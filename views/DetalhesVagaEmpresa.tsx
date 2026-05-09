import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    GraduationCap,
    Mail,
    MapPin,
    Pencil,
    Phone,
    User,
    Users,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import styles, { colors } from "../assets/style/estilo";
import { db } from "../config/firebase";

interface RouteParams {
    vagaId?: string;
}

interface VagaDetalhe {
    id: string;
    titulo: string;
    descricao: string;
    exigencias: string;
    localizacao: string;
    tipo: string;
    cargaHoraria: string;
    bolsa: string;
    publicadoEm: string;
    status: string;
}

interface CandidatoVaga {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    dtNascimento: string;
    endereco: string;
    escolaridades: Array<{
        id: string;
        nivelEscolaridade: string;
        instituicao: string;
        curso: string;
        anoInicio: string;
        anoConclusao: string;
    }>;
    qualificacoes: Array<{
        id: string;
        titulo: string;
        tipo: string;
        instituicao: string;
        cargaHoraria: number;
        dtInicio: string;
        dtFinal: string;
    }>;
    dataCandidatura: string;
    status: string;
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

function getStatusLabel(status: unknown): string {
    if (status === "pausada") return "Pausada";
    if (status === "encerrada") return "Encerrada";
    if (status === "em-analise") return "Em análise";
    if (status === "aprovado") return "Aprovado";
    if (status === "recusado") return "Recusado";
    return "Ativa";
}

export default function DetalhesVagaEmpresa() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vagaId } = (route.params ?? {}) as RouteParams;
    const [vaga, setVaga] = useState<VagaDetalhe | null>(null);
    const [candidatos, setCandidatos] = useState<CandidatoVaga[]>([]);
    const [candidatoAbertoId, setCandidatoAbertoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusVagaMap, setStatusVagaMap] = useState<Record<string, string>>({});

    const editarVaga = () => {
        if (!vagaId) return;
        navigation.navigate("CadastroVaga", { vagaId, modo: "editar" });
    };

    useEffect(() => {
    async function carregarStatusVaga() {
        try {
            const snapshot = await getDocs(collection(db, "status_vaga"));
            const mapa: Record<string, string> = {};
            snapshot.docs.forEach((documento) => {
                const data = documento.data();
                mapa[documento.id] = data.nome ?? data.descricao ?? documento.id;
            });
            setStatusVagaMap(mapa);
        } catch (_) {}
    }

    carregarStatusVaga();
}, []);

    useFocusEffect(
        useCallback(() => {
            async function carregarDetalhes() {
                if (!vagaId) {
                    setVaga(null);
                    setCandidatos([]);
                    setLoading(false);
                    return;
                }

                setLoading(true);

                try {
                    const [vagaSnapshot, candidaturasSnapshot] = await Promise.all([
                        getDoc(doc(db, "vagas", vagaId)),
                        getDocs(query(collection(db, "candidaturas"), where("idVaga", "==", vagaId))),
                    ]);
                    const data = vagaSnapshot.data() ?? {};

                    setVaga({
                        id: vagaSnapshot.id,
                        titulo: data.titulo ?? "Vaga sem título",
                        descricao: data.descricao ?? "Descrição não informada.",
                        exigencias: data.exigencias ?? "Exigências não informadas.",
                        localizacao:
                            data.localizacao ?? data.cidade ?? data.endereco?.cidade ?? "Local não informado",
                        tipo: data.tipo ?? "Estágio",
                        cargaHoraria: data.cargaHoraria ? `${data.cargaHoraria}h/semana` : "Não informada",
                        bolsa: data.temBolsa
                            ? `R$ ${Number(data.valorBolsa ?? 0).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                            })}`
                            : "Sem bolsa",
                        publicadoEm: formatarData(data.publicadoEm ?? data.createdAt),
                        status: statusVagaMap[data.idStatusVaga] ?? getStatusLabel(data.idStatusVaga)
                    });

                    const idsCandidatos = candidaturasSnapshot.docs
                        .map((documento) => {
                            const candidatura = documento.data();
                            return candidatura.idCandidato ?? candidatura.candidato?.id;
                        })
                        .filter(Boolean);
                    const qualificacoesSnapshots = await Promise.all(
                        idsCandidatos.map((idCandidato) =>
                            getDocs(
                                query(
                                    collection(db, "qualificacoes"),
                                    where("idEstudante", "==", idCandidato)
                                )
                            )
                        )
                    );
                    const qualificacoesPorEstudante = new Map<string, CandidatoVaga["qualificacoes"]>();

                    qualificacoesSnapshots.forEach((snapshot, index) => {
                        const idCandidato = String(idsCandidatos[index]);

                        qualificacoesPorEstudante.set(
                            idCandidato,
                            snapshot.docs.map((documento) => {
                                const qualificacao = documento.data();

                                return {
                                    id: documento.id,
                                    titulo: qualificacao.titulo ?? "Qualificação sem título",
                                    tipo: qualificacao.tipo ?? "Tipo não informado",
                                    instituicao:
                                        qualificacao.instituicao_escolaridade ??
                                        "Instituição não informada",
                                    cargaHoraria: Number(qualificacao.carga_horaria) || 0,
                                    dtInicio: qualificacao.dt_inicio ?? "",
                                    dtFinal: qualificacao.dt_final ?? "",
                                };
                            })
                        );
                    });

                    const listaCandidatos = candidaturasSnapshot.docs.map((documento) => {
                        const candidatura = documento.data();
                        const candidato = candidatura.candidato ?? {};
                        const idCandidato = candidatura.idCandidato ?? candidato.id ?? "";
                        const endereco = candidato.endereco ?? {};
                        const enderecoCompleto = [
                            endereco.rua,
                            endereco.numero,
                            endereco.complemento,
                            endereco.bairro,
                            endereco.cidade,
                            endereco.estado,
                        ]
                            .filter(Boolean)
                            .join(", ");

                        return {
                            id: documento.id,
                            nome: candidato.nome ?? "Candidato sem nome",
                            email: candidato.email ?? "E-mail não informado",
                            telefone: candidato.telefone ?? "Telefone não informado",
                            cpf: candidato.cpf ?? "CPF não informado",
                            dtNascimento: candidato.dt_nascimento ?? "Data não informada",
                            endereco: enderecoCompleto || "Endereço não informado",
                            escolaridades: (candidato.escolaridades ?? []).map((escolaridade: any) => ({
                                id: escolaridade.id ?? `${documento.id}-${escolaridade.curso ?? escolaridade.instituicao}`,
                                nivelEscolaridade: escolaridade.nivelEscolaridade ?? "",
                                instituicao: escolaridade.instituicao ?? "",
                                curso: escolaridade.curso ?? "",
                                anoInicio: escolaridade.anoInicio ?? "",
                                anoConclusao: escolaridade.anoConclusao ?? "",
                            })),
                            qualificacoes: qualificacoesPorEstudante.get(String(idCandidato)) ?? [],
                            dataCandidatura: formatarData(candidatura.createdAt),
                            status: getStatusLabel(candidatura.status ?? "pendente"),
                        };
                    });

                    setCandidatos(listaCandidatos);
                } catch (error) {
                    console.log("Erro ao carregar detalhes da vaga:", error);
                    setVaga(null);
                    setCandidatos([]);
                } finally {
                    setLoading(false);
                }
            }

            carregarDetalhes();
        }, [vagaId])
    );

    const abrirWhatsApp = async (telefone: string) => {
        const numeros = telefone.replace(/\D/g, "");

        if (!numeros) {
            Alert.alert("Atenção", "Este candidato não possui telefone cadastrado.");
            return;
        }

        const numeroComPais = numeros.startsWith("55") ? numeros : `55${numeros}`;
        const url = `https://wa.me/${numeroComPais}`;

        try {
            const podeAbrir = await Linking.canOpenURL(url);

            if (!podeAbrir) {
                Alert.alert("Atenção", "Não foi possível abrir o WhatsApp neste dispositivo.");
                return;
            }

            await Linking.openURL(url);
        } catch (_) {
            Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.homeHeader}>
                <View style={styles.homeHeaderRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
                        <ArrowLeft size={24} color={colors.labelDark} />
                    </TouchableOpacity>
                    <Text style={[styles.screenHeaderTitle, { flex: 1, marginLeft: 12 }]}>
                        Gerenciar Vaga
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.emptyCard}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>
                            Carregando detalhes da vaga...
                        </Text>
                    </View>
                ) : !vaga ? (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Briefcase size={36} color={colors.labelMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>Vaga não encontrada</Text>
                        <Text style={styles.emptySubtitle}>
                            Não foi possível carregar os detalhes desta vaga.
                        </Text>
                    </View>
                ) : (
                    <View style={{ gap: 12 }}>
                        <View style={[styles.candidaturaCard, { gap: 12 }]}>
                            <View style={styles.candidaturaCardTop}>
                                <View style={{ flex: 1, gap: 6 }}>
                                    <Text style={styles.screenHeaderTitle}>{vaga.titulo}</Text>
                                    <View style={styles.jobTagsRow}>
                                        <View style={styles.jobTag}>
                                            <MapPin size={12} color={colors.labelMuted} />
                                            <Text style={styles.jobTagText}>{vaga.localizacao}</Text>
                                        </View>
                                        <View style={styles.jobTag}>
                                            <Clock size={12} color={colors.labelMuted} />
                                            <Text style={styles.jobTagText}>{vaga.tipo}</Text>
                                        </View>
                                        <View style={styles.jobTag}>
                                            <DollarSign size={12} color={colors.labelMuted} />
                                            <Text style={styles.jobTagText}>{vaga.bolsa}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusBadgeText}>{vaga.status}</Text>
                                </View>
                            </View>

                            <View style={{ gap: 8 }}>
                                <View style={styles.candidaturaMetaRow}>
                                    <Calendar size={14} color={colors.labelMuted} />
                                    <Text style={styles.candidaturaMetaText}>
                                        Publicada em {vaga.publicadoEm}
                                    </Text>
                                </View>
                                <View style={styles.candidaturaMetaRow}>
                                    <Clock size={14} color={colors.labelMuted} />
                                    <Text style={styles.candidaturaMetaText}>
                                        {vaga.cargaHoraria}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.jobCardFooter}>
                                <View style={{ flex: 1, gap: 10 }}>
                                    <View style={{ gap: 4 }}>
                                        <Text style={styles.jobTitle}>Descrição</Text>
                                        <Text style={styles.jobDescription}>{vaga.descricao}</Text>
                                    </View>
                                    <View style={{ gap: 4 }}>
                                        <Text style={styles.jobTitle}>Exigências</Text>
                                        <Text style={styles.jobDescription}>{vaga.exigencias}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.buttonPrimary, { flex: 0 }]}
                                onPress={editarVaga}
                                activeOpacity={0.8}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                    <Pencil size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Atualizar vaga</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 4 }}>
                            <Text style={styles.screenHeaderTitle}>Candidatos</Text>
                            <Text style={styles.screenHeaderSubtitle}>
                                {candidatos.length} candidato{candidatos.length !== 1 ? "s" : ""} nesta vaga
                            </Text>
                        </View>

                        {candidatos.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <View style={styles.emptyIconWrapper}>
                                    <Users size={36} color={colors.labelMuted} />
                                </View>
                                <Text style={styles.emptyTitle}>Nenhum candidato ainda</Text>
                                <Text style={styles.emptySubtitle}>
                                    As candidaturas recebidas aparecerão aqui.
                                </Text>
                            </View>
                        ) : (
                            <View style={{ gap: 12 }}>
                                {candidatos.map((candidato) => {
                                    const expanded = candidatoAbertoId === candidato.id;

                                    return (
                                        <TouchableOpacity
                                            key={candidato.id}
                                            style={styles.candidaturaCard}
                                            onPress={() =>
                                                setCandidatoAbertoId((current) =>
                                                    current === candidato.id ? null : candidato.id
                                                )
                                            }
                                            activeOpacity={0.85}
                                        >
                                            <View style={styles.candidaturaCardTop}>
                                                <View style={{ flex: 1, gap: 6 }}>
                                                    <Text style={styles.candidaturaTitle}>
                                                        {candidato.nome}
                                                    </Text>
                                                    <View style={styles.candidaturaMetaRow}>
                                                        <Mail size={14} color={colors.labelMuted} />
                                                        <Text style={styles.candidaturaMetaText}>
                                                            {candidato.email}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.candidaturaMetaRow}>
                                                        <Phone size={14} color={colors.labelMuted} />
                                                        <Text style={styles.candidaturaMetaText}>
                                                            {candidato.telefone}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.statusBadge}>
                                                    <Text style={styles.statusBadgeText}>
                                                        {candidato.status}
                                                    </Text>
                                                </View>
                                            </View>

                                            {expanded && (
                                                <View style={{ gap: 12 }}>
                                                    <View style={styles.jobCardFooter}>
                                                        <View style={{ flex: 1, gap: 10 }}>
                                                            <View style={styles.candidaturaMetaRow}>
                                                                <User size={14} color={colors.labelMuted} />
                                                                <Text style={styles.candidaturaMetaText}>
                                                                    CPF: {candidato.cpf}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.candidaturaMetaRow}>
                                                                <Calendar size={14} color={colors.labelMuted} />
                                                                <Text style={styles.candidaturaMetaText}>
                                                                    Nascimento: {candidato.dtNascimento}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.candidaturaMetaRow}>
                                                                <MapPin size={14} color={colors.labelMuted} />
                                                                <Text style={styles.candidaturaMetaText}>
                                                                    {candidato.endereco}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={{ gap: 8 }}>
                                                        <Text style={styles.jobTitle}>Escolaridades</Text>
                                                        {candidato.escolaridades.length > 0 ? (
                                                            candidato.escolaridades.map((escolaridade) => (
                                                                <View
                                                                    key={escolaridade.id}
                                                                    style={styles.escolaridadeCard}
                                                                >
                                                                    <GraduationCap
                                                                        size={16}
                                                                        color={colors.primary}
                                                                    />
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text
                                                                            style={[
                                                                                styles.escolaridadeText,
                                                                                {
                                                                                    color: colors.primary,
                                                                                    fontWeight: "600",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {escolaridade.curso ||
                                                                                escolaridade.nivelEscolaridade ||
                                                                                "Curso não informado"}
                                                                        </Text>
                                                                        <Text style={styles.escolaridadeText}>
                                                                            {escolaridade.instituicao ||
                                                                                "Instituição não informada"}
                                                                        </Text>
                                                                        <Text
                                                                            style={[
                                                                                styles.escolaridadeText,
                                                                                {
                                                                                    fontSize: 12,
                                                                                    color: colors.labelMuted,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {escolaridade.anoInicio || "Início não informado"} -{" "}
                                                                            {escolaridade.anoConclusao || "Cursando"}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text style={styles.jobDescription}>
                                                                Nenhuma escolaridade informada.
                                                            </Text>
                                                        )}
                                                    </View>

                                                    <View style={{ gap: 8 }}>
                                                        <Text style={styles.jobTitle}>Qualificações</Text>
                                                        {candidato.qualificacoes.length > 0 ? (
                                                            candidato.qualificacoes.map((qualificacao) => (
                                                                <View
                                                                    key={qualificacao.id}
                                                                    style={styles.escolaridadeCard}
                                                                >
                                                                    <Briefcase
                                                                        size={16}
                                                                        color={colors.primary}
                                                                    />
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text
                                                                            style={[
                                                                                styles.escolaridadeText,
                                                                                {
                                                                                    color: colors.primary,
                                                                                    fontWeight: "600",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {qualificacao.titulo}
                                                                        </Text>
                                                                        <Text style={styles.escolaridadeText}>
                                                                            {qualificacao.tipo} - {qualificacao.instituicao}
                                                                        </Text>
                                                                        <Text
                                                                            style={[
                                                                                styles.escolaridadeText,
                                                                                {
                                                                                    fontSize: 12,
                                                                                    color: colors.labelMuted,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {qualificacao.dtInicio || "Início não informado"}
                                                                            {qualificacao.dtFinal
                                                                                ? ` - ${qualificacao.dtFinal}`
                                                                                : ""}{" "}
                                                                            · {qualificacao.cargaHoraria}h
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            ))
                                                        ) : (
                                                            <Text style={styles.jobDescription}>
                                                                Nenhuma qualificação informada.
                                                            </Text>
                                                        )}
                                                    </View>

                                                    <View style={styles.candidaturaCardFooter}>
                                                        <Text style={styles.candidaturaDate}>
                                                            Candidatura em {candidato.dataCandidatura}
                                                        </Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        style={[
                                                            styles.buttonPrimary,
                                                            {
                                                                flex: 0,
                                                                backgroundColor: "#16a34a",
                                                            },
                                                        ]}
                                                        onPress={() => abrirWhatsApp(candidato.telefone)}
                                                        activeOpacity={0.8}
                                                    >
                                                        <View
                                                            style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                gap: 6,
                                                            }}
                                                        >
                                                            <Phone size={18} color="#fff" />
                                                            <Text style={styles.buttonText}>
                                                                Encaminhar para WhatsApp
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
