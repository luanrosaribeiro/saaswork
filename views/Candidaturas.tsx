import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Clock, CheckCircle, XCircle, Building2, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import styles, { colors } from "../assets/style/estilo";
import { db } from "../config/firebase";
import { useUser } from "../context/UserContext";
import { AuthService } from "../services/AuthService";
import { Estudante } from "../models/Estudante";

type Status = "pendente" | "em-analise" | "aprovado" | "recusado";

interface CandidaturaItem {
    id: string;
    titulo: string;
    instituicao: string;
    localizacao: string;
    dataCandidatura: string;
    status: Status;
}

interface StatusConfig {
    text: string;
    Icon: React.ComponentType<{ size: number; color: string }>;
    bgColor: string;
    textColor: string;
    iconColor: string;
}

const STATUS_CONFIG: Record<Status, StatusConfig> = {
    pendente: {
        text: "Pendente",
        Icon: Clock,
        bgColor: "#f3f4f6",
        textColor: "#4b5563",
        iconColor: "#6b7280",
    },
    "em-analise": {
        text: "Em Análise",
        Icon: Clock,
        bgColor: "#eff6ff",
        textColor: "#2563eb",
        iconColor: "#3b82f6",
    },
    aprovado: {
        text: "Aprovado",
        Icon: CheckCircle,
        bgColor: "#f0fdf4",
        textColor: "#16a34a",
        iconColor: "#22c55e",
    },
    recusado: {
        text: "Recusado",
        Icon: XCircle,
        bgColor: "#fef2f2",
        textColor: "#dc2626",
        iconColor: "#ef4444",
    },
};

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

function normalizarStatus(status: unknown): Status {
    if (
        status === "pendente" ||
        status === "em-analise" ||
        status === "aprovado" ||
        status === "recusado"
    ) {
        return status;
    }

    return "pendente";
}

export default function CandidaturasScreen() {
    const { usuario, setUsuario } = useUser();
    const [candidaturas, setCandidaturas] = useState<CandidaturaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            async function carregarCandidaturas() {
                setLoading(true);

                try {
                    let estudanteLogado = usuario;
                    const usuarioAtual = AuthService.usuarioAtual();

                    if (!estudanteLogado && usuarioAtual?.uid) {
                        estudanteLogado = await AuthService.buscarPerfil(usuarioAtual.uid);
                        setUsuario(estudanteLogado);
                    }

                    if (!estudanteLogado || estudanteLogado.tipo !== "estudante") {
                        setCandidaturas([]);
                        return;
                    }

                    const estudante = estudanteLogado as Estudante;
                    const [candidaturasSnapshot, empresasSnapshot] = await Promise.all([
                        getDocs(query(collection(db, "candidaturas"), where("idCandidato", "==", estudante.id))),
                        getDocs(collection(db, "empresas")),
                    ]);

                    const empresasPorId = new Map(
                        empresasSnapshot.docs.map((documento) => {
                            const data = documento.data();
                            return [documento.id, data.nomeEmpresa ?? data.nome ?? documento.id];
                        })
                    );
                    const lista = candidaturasSnapshot.docs.map((documento) => {
                        const data = documento.data();
                        const vaga = data.vaga ?? {};
                        const instituicao =
                            empresasPorId.get(vaga.idEmpresa) ??
                            data.instituicao ??
                            data.nomeEmpresa ??
                            "Instituição não informada";

                        return {
                            id: documento.id,
                            titulo: vaga.titulo ?? data.titulo ?? "Vaga sem título",
                            instituicao,
                            localizacao:
                                vaga.localizacao ??
                                data.localizacao ??
                                data.cidade ??
                                "Local não informado",
                            dataCandidatura: formatarData(data.createdAt),
                            status: normalizarStatus(data.status),
                        };
                    });

                    setCandidaturas(lista);
                } catch (error) {
                    console.log("Erro ao carregar candidaturas:", error);
                    setCandidaturas([]);
                } finally {
                    setLoading(false);
                }
            }

            carregarCandidaturas();
        }, [setUsuario, usuario])
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.screenHeaderTitle}>Minhas Candidaturas</Text>
                    <Text style={styles.screenHeaderSubtitle}>
                        Acompanhe o status das suas candidaturas
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.emptyCard}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>
                            Carregando candidaturas...
                        </Text>
                    </View>
                ) : candidaturas.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Building2 size={40} color={colors.placeholder} />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma candidatura ainda</Text>
                        <Text style={styles.emptySubtitle}>
                            Comece a se candidatar nas vagas disponíveis.
                        </Text>
                    </View>
                ) : (
                    <View style={{ gap: 12 }}>
                        {candidaturas.map((candidatura) => {
                            const cfg = STATUS_CONFIG[candidatura.status];
                            const { Icon } = cfg;

                            return (
                                <View key={candidatura.id} style={styles.candidaturaCard}>
                                    <View style={styles.candidaturaCardTop}>
                                        <View style={{ flex: 1, gap: 4 }}>
                                            <Text style={styles.candidaturaTitle}>
                                                {candidatura.titulo}
                                            </Text>
                                            <View style={styles.candidaturaMetaRow}>
                                                <Building2 size={14} color={colors.labelMuted} />
                                                <Text style={styles.candidaturaMetaText}>
                                                    {candidatura.instituicao}
                                                </Text>
                                            </View>
                                            <View style={styles.candidaturaMetaRow}>
                                                <MapPin size={14} color={colors.placeholder} />
                                                <Text style={styles.candidaturaMetaMuted}>
                                                    {candidatura.localizacao}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.statusBadge,
                                                { backgroundColor: cfg.bgColor },
                                            ]}
                                        >
                                            <Icon size={12} color={cfg.iconColor} />
                                            <Text
                                                style={[
                                                    styles.statusBadgeText,
                                                    { color: cfg.textColor },
                                                ]}
                                            >
                                                {cfg.text}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.candidaturaCardFooter}>
                                        <Text style={styles.candidaturaDate}>
                                            Candidatura em {candidatura.dataCandidatura}
                                        </Text>
                                        <TouchableOpacity>
                                            <Text style={styles.candidaturaDetailLink}>
                                                Ver detalhes
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
