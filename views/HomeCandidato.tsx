import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import {
    Search,
    Filter,
    Bell,
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Building2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import styles, { colors } from "../assets/style/estilo";
import { db } from "../config/firebase";
import { useUser } from "../context/UserContext";
import { AuthService } from "../services/AuthService";
import { Aluno } from "../models/Aluno";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vaga {
    id: string;
    titulo: string;
    descricao: string;
    exigencias: string;
    instituicao: string;
    localizacao: string;
    tipo: string;
    salario?: string;
    publicadoEm: string;
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

function formatarCargaHoraria(cargaHoraria: unknown): string {
    const horas = Number(cargaHoraria);

    if (!horas || Number.isNaN(horas)) {
        return "Carga horária não informada";
    }

    return `${horas}h/semana`;
}

// ─── JobCard ──────────────────────────────────────────────────────────────────

interface JobCardProps extends Vaga {
    expanded: boolean;
    onToggle: (id: string) => void;
    onCandidatar: (id: string) => void;
}

function JobCard({
    id,
    titulo,
    descricao,
    exigencias,
    instituicao,
    localizacao,
    tipo,
    salario,
    publicadoEm,
    expanded,
    onToggle,
    onCandidatar,
}: JobCardProps) {
    return (
        <TouchableOpacity
            style={styles.jobCard}
            onPress={() => onToggle(id)}
            activeOpacity={0.85}
        >
            {/* Título + instituição */}
            <View style={styles.jobCardHeader}>
                <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.jobTitle}>{titulo}</Text>
                    <View style={styles.jobMetaRow}>
                        <Building2 size={14} color={colors.labelMuted} />
                        <Text style={styles.jobMetaText}>{instituicao}</Text>
                    </View>
                </View>
            </View>

            {/* Tags */}
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

            {expanded && (
                <View style={{ gap: 10 }}>
                    <View style={styles.jobCardFooter}>
                        <View style={{ flex: 1, gap: 10 }}>
                            <View style={{ gap: 4 }}>
                                <Text style={styles.jobTitle}>Descrição</Text>
                                <Text style={styles.jobDescription}>
                                    {descricao || "Descrição não informada."}
                                </Text>
                            </View>

                            <View style={{ gap: 4 }}>
                                <Text style={styles.jobTitle}>Exigências</Text>
                                <Text style={styles.jobDescription}>
                                    {exigencias || "Exigências não informadas."}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                        }}
                    >
                        <Text style={styles.jobPublishedAt}>{publicadoEm}</Text>
                        <TouchableOpacity
                            style={styles.candidatarButton}
                            onPress={() => onCandidatar(id)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.candidatarButtonText}>Candidatar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!expanded && <Text style={styles.jobPublishedAt}>{publicadoEm}</Text>}
        </TouchableOpacity>
    );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const { usuario, setUsuario } = useUser();
    const [search, setSearch] = useState("");
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [expandedVagaId, setExpandedVagaId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const notificacoes = 3;

    useEffect(() => {
        async function carregarVagas() {
            setLoading(true);

            try {
                let alunoLogado = usuario;
                const usuarioAtual = AuthService.usuarioAtual();

                if (!alunoLogado && usuarioAtual?.uid) {
                    alunoLogado = await AuthService.buscarPerfil(usuarioAtual.uid);
                    setUsuario(alunoLogado);
                }

                if (!alunoLogado || alunoLogado.tipo !== "aluno") {
                    setVagas([]);
                    return;
                }

                const aluno = alunoLogado as Aluno;
                const instituicoesAlunoIds = new Set(
                    aluno.escolaridades
                        .map((escolaridade) => escolaridade.idInstituicaoEscolaridade)
                        .filter(Boolean)
                );
                const instituicoesAlunoNomes = new Set(
                    aluno.escolaridades
                        .map((escolaridade) => escolaridade.instituicao)
                        .filter(Boolean)
                );

                const [vagasSnapshot, tiposSnapshot, instituicoesSnapshot] = await Promise.all([
                    getDocs(collection(db, "vagas")),
                    getDocs(collection(db, "tipos_vaga")),
                    getDocs(collection(db, "instituicoes")),
                ]);

                const tiposPorId = new Map(
                    tiposSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return [doc.id, data.nome ?? data.descricao ?? doc.id];
                    })
                );

                const instituicoesPorId = new Map(
                    instituicoesSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return [doc.id, data.nomeEmpresa ?? data.nome ?? doc.id];
                    })
                );

                const vagasDoAluno = vagasSnapshot.docs
                    .filter((doc) => {
                        const data = doc.data();
                        const instituicaoFoco =
                            data.idInstituicaoFoco ?? data.instituicaoFoco ?? data.instituicao_foco;

                        return (
                            !instituicaoFoco ||
                            instituicaoFoco === "todos" ||
                            instituicoesAlunoIds.has(String(instituicaoFoco)) ||
                            instituicoesAlunoNomes.has(String(instituicaoFoco))
                        );
                    })
                    .map((doc) => {
                        const data = doc.data();
                        const tipo = tiposPorId.get(data.idTipoVaga) ?? data.tipo ?? "Estágio";
                        const instituicao =
                            instituicoesPorId.get(data.idEmpresa) ??
                            data.instituicao ??
                            data.nomeEmpresa ??
                            "Instituição não informada";

                        return {
                            id: doc.id,
                            titulo: data.titulo ?? `Vaga de ${tipo}`,
                            descricao: data.descricao ?? "Descrição não informada.",
                            exigencias: data.exigencias ?? "",
                            instituicao,
                            localizacao:
                                data.localizacao ?? data.cidade ?? data.endereco?.cidade ?? "Local não informado",
                            tipo: data.tipo ?? tipo,
                            salario: data.salario ?? formatarCargaHoraria(data.cargaHoraria),
                            publicadoEm: formatarData(data.publicadoEm ?? data.createdAt),
                        };
                    });

                setVagas(vagasDoAluno);
            } catch (_) {
                Alert.alert("Erro", "Não foi possível carregar as vagas disponíveis.");
                setVagas([]);
            } finally {
                setLoading(false);
            }
        }

        carregarVagas();
    }, [setUsuario, usuario]);

    const vagasFiltradas = useMemo(
        () =>
            vagas.filter(
                (v) =>
                    v.titulo.toLowerCase().includes(search.toLowerCase()) ||
                    v.instituicao.toLowerCase().includes(search.toLowerCase()) ||
                    v.descricao.toLowerCase().includes(search.toLowerCase())
            ),
        [search, vagas]
    );

    const handleCandidatar = (id: string) => {
        console.log("Candidatar vaga:", id);
        // Navegue ou exiba modal de confirmação aqui
    };

    const handleToggleVaga = (id: string) => {
        setExpandedVagaId((current) => (current === id ? null : id));
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header fixo */}
            <View style={styles.homeHeader}>
                {/* Linha: título + sino */}
                <View style={styles.homeHeaderRow}>
                    <Text style={styles.screenHeaderTitle}>Vagas</Text>
                    <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
                        <Bell size={24} color={colors.labelMuted} />
                        {notificacoes > 0 && (
                            <View style={styles.bellBadge}>
                                <Text style={styles.bellBadgeText}>{notificacoes}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Barra de busca */}
                <View style={styles.searchBar}>
                    <Search size={20} color={colors.placeholder} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar vagas..."
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

            {/* Lista */}
            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.screenHeaderTitle}>Vagas Disponíveis</Text>
                    <Text style={styles.screenHeaderSubtitle}>
                        {vagasFiltradas.length} oportunidade
                        {vagasFiltradas.length !== 1 ? "s" : ""} encontrada
                        {vagasFiltradas.length !== 1 ? "s" : ""}
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.emptyCard}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>
                            Carregando vagas disponíveis...
                        </Text>
                    </View>
                ) : vagasFiltradas.length > 0 ? (
                    <View style={{ gap: 12 }}>
                        {vagasFiltradas.map((vaga) => (
                            <JobCard
                                key={vaga.id}
                                {...vaga}
                                expanded={expandedVagaId === vaga.id}
                                onToggle={handleToggleVaga}
                                onCandidatar={handleCandidatar}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Briefcase size={36} color={colors.labelMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma vaga encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            As vagas compatíveis com a sua instituição aparecerão aqui.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
