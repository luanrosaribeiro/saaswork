import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Bell,
    Briefcase,
    Clock,
    DollarSign,
    Filter,
    MapPin,
    Plus,
    Search,
    Users,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import styles, { colors } from "../assets/style/estilo";
import { db } from "../config/firebase";
import { useUser } from "../context/UserContext";

interface VagaEmpresa {
    id: string;
    titulo: string;
    descricao: string;
    localizacao: string;
    tipo: string;
    salario?: string;
    publicadoEm: string;
    status: "ativa" | "pausada" | "encerrada";
    candidatos: number;
}

interface EmpresaJobCardProps extends VagaEmpresa {
    onGerenciar: (vagaId: string) => void;
}

function formatarData(data: unknown): string {
    if (!data) return "Sem data";

    if (typeof data === "string") {
        return data;
    }

    if (typeof data === "object" && "toDate" in data && typeof data.toDate === "function") {
        return data.toDate().toLocaleDateString("pt-BR");
    }

    return "Sem data";
}

function getStatusStyle(status: VagaEmpresa["status"]) {
    const statusStyles = {
        ativa: {
            backgroundColor: "#dcfce7",
            color: "#166534",
            label: "Ativa",
        },
        pausada: {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            label: "Pausada",
        },
        encerrada: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            label: "Encerrada",
        },
    };

    return statusStyles[status];
}

function normalizarStatus(status: unknown): VagaEmpresa["status"] {
    if (status === "pausada" || status === "encerrada") {
        return status;
    }

    return "ativa";
}

function EmpresaJobCard({
    id,
    titulo,
    descricao,
    localizacao,
    tipo,
    salario,
    publicadoEm,
    status,
    candidatos,
    onGerenciar,
}: EmpresaJobCardProps) {
    const statusStyle = getStatusStyle(status);

    return (
        <View style={styles.jobCard}>
            <View style={styles.jobCardHeader}>
                <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.jobTitle}>{titulo}</Text>
                    <View style={styles.jobMetaRow}>
                        <Users size={14} color={colors.labelMuted} />
                        <Text style={styles.jobMetaText}>
                            {candidatos} candidato{candidatos !== 1 ? "s" : ""}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                    ]}
                >
                    <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                        {statusStyle.label}
                    </Text>
                </View>
            </View>

            <Text style={styles.jobDescription} numberOfLines={2}>
                {descricao}
            </Text>

            <View style={styles.jobTagsRow}>
                <View style={styles.jobTag}>
                    <MapPin size={12} color={colors.labelMuted} />
                    <Text style={styles.jobTagText}>{localizacao}</Text>
                </View>
                <View style={styles.jobTag}>
                    <Clock size={12} color={colors.labelMuted} />
                    <Text style={styles.jobTagText}>{tipo}</Text>
                </View>
                {salario && (
                    <View style={styles.jobTag}>
                        <DollarSign size={12} color={colors.labelMuted} />
                        <Text style={styles.jobTagText}>{salario}</Text>
                    </View>
                )}
            </View>

            <View style={styles.jobCardFooter}>
                <Text style={styles.jobPublishedAt}>{publicadoEm}</Text>
                <TouchableOpacity
                    style={styles.candidatarButton}
                    onPress={() => onGerenciar(id)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.candidatarButtonText}>Gerenciar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function HomeEmpresa() {
    const navigation = useNavigation<any>();
    const { usuario } = useUser();
    const [search, setSearch] = useState("");
    const [vagas, setVagas] = useState<VagaEmpresa[]>([]);
    const [loading, setLoading] = useState(true);
    const notificacoes = 0;

    useFocusEffect(
        useCallback(() => {
        const carregarVagas = async () => {
            if (!usuario?.id || usuario.tipo !== "empresa") {
                setVagas([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const vagasRef = collection(db, "vagas");
                const vagasQuery = query(vagasRef, where("idEmpresa", "==", usuario.id));
                const snapshot = await getDocs(vagasQuery);

                const vagasDaEmpresa = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        titulo: data.titulo ?? "Vaga sem título",
                        descricao: data.descricao ?? "",
                        localizacao: data.localizacao ?? data.cidade ?? "Local não informado",
                        tipo: data.tipo ?? "Estágio",
                        salario: data.salario,
                        publicadoEm: formatarData(data.publicadoEm ?? data.createdAt),
                        status: normalizarStatus(data.status),
                        candidatos: data.candidatos ?? data.totalCandidatos ?? 0,
                    };
                });

                setVagas(vagasDaEmpresa);
            } catch (error) {
                console.log("Erro ao carregar vagas da empresa:", error);
                setVagas([]);
            } finally {
                setLoading(false);
            }
        };

        carregarVagas();
    }, [usuario])
    );

    const vagasFiltradas = useMemo(
        () =>
            vagas.filter(
                (vaga) =>
                    vaga.titulo.toLowerCase().includes(search.toLowerCase()) ||
                    vaga.localizacao.toLowerCase().includes(search.toLowerCase()) ||
                    vaga.status.toLowerCase().includes(search.toLowerCase())
            ),
        [search, vagas]
    );

    const vagasAtivas = vagas.filter((vaga) => vaga.status === "ativa").length;
    const totalCandidatos = vagas.reduce((total, vaga) => total + vaga.candidatos, 0);
    const handleCadastrarVaga = () => {
        navigation.navigate("CadastroVaga", { vagaId: null, modo: "criar" });
    };
    const handleGerenciarVaga = (vagaId: string) => {
        navigation.navigate("DetalhesVagaEmpresa", { vagaId });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.homeHeader}>
                <View style={styles.homeHeaderRow}>
                    <Text style={styles.screenHeaderTitle}>Minhas Vagas</Text>
                    <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
                        <Bell size={24} color={colors.labelMuted} />
                        {notificacoes > 0 && (
                            <View style={styles.bellBadge}>
                                <Text style={styles.bellBadgeText}>{notificacoes}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.searchBar}>
                    <Search size={20} color={colors.placeholder} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar vagas cadastradas..."
                        placeholderTextColor={colors.placeholder}
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity activeOpacity={0.7}>
                        <Filter size={20} color={colors.labelMuted} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.screenHeaderTitle}>Vagas Cadastradas</Text>
                    <Text style={styles.screenHeaderSubtitle}>
                        {vagasAtivas} ativa{vagasAtivas !== 1 ? "s" : ""} ·{" "}
                        {totalCandidatos} candidato{totalCandidatos !== 1 ? "s" : ""}
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.emptyCard}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>
                            Carregando vagas cadastradas...
                        </Text>
                    </View>
                ) : vagasFiltradas.length > 0 ? (
                    <View style={{ gap: 12 }}>
                        {vagasFiltradas.map((vaga) => (
                            <EmpresaJobCard
                                key={vaga.id}
                                {...vaga}
                                onGerenciar={handleGerenciarVaga}
                            />
                        ))}
                    </View>
                ) : vagas.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Briefcase size={36} color={colors.labelMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma vaga encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            As vagas cadastradas pela empresa logada aparecerão aqui.
                        </Text>
                        <TouchableOpacity
                            style={[styles.candidatarButton, { marginTop: 18 }]}
                            onPress={handleCadastrarVaga}
                            activeOpacity={0.8}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <Plus size={16} color={colors.white} />
                                <Text style={styles.candidatarButtonText}>Cadastrar vaga</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Search size={36} color={colors.labelMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma vaga encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            Tente buscar por outro título, local ou status.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
