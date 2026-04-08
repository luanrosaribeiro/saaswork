import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Clock, CheckCircle, XCircle, Building2, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles, { colors } from "../assets/style/estilo";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "pendente" | "em-analise" | "aprovado" | "recusado";

interface Candidatura {
    id: string;
    titulo: string;
    instituicao: string;
    localizacao: string;
    dataCandidatura: string;
    status: Status;
}

// ─── Status config ────────────────────────────────────────────────────────────

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

// ─── Mock data ────────────────────────────────────────────────────────────────

const CANDIDATURAS: Candidatura[] = [
    {
        id: "1",
        titulo: "Desenvolvedor Front-end",
        instituicao: "Tech Solutions",
        localizacao: "São Paulo, SP",
        dataCandidatura: "01/04/2026",
        status: "em-analise",
    },
    {
        id: "2",
        titulo: "Designer UI/UX",
        instituicao: "Creative Studio",
        localizacao: "Rio de Janeiro, RJ",
        dataCandidatura: "28/03/2026",
        status: "pendente",
    },
    {
        id: "3",
        titulo: "Product Manager",
        instituicao: "StartupXYZ",
        localizacao: "Curitiba, PR",
        dataCandidatura: "25/03/2026",
        status: "aprovado",
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CandidaturasScreen() {
    const candidaturas = CANDIDATURAS;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.screenHeader}>
                <Text style={styles.screenHeaderTitle}>Minhas Candidaturas</Text>
                <Text style={styles.screenHeaderSubtitle}>
                    Acompanhe o status das suas candidaturas
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
            >
                {candidaturas.length === 0 ? (
                    /* Estado vazio */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Building2 size={40} color={colors.placeholder} />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma candidatura ainda</Text>
                        <Text style={styles.emptySubtitle}>
                            Comece a se candidatar nas vagas disponíveis!
                        </Text>
                    </View>
                ) : (
                    /* Lista de candidaturas */
                    <View style={{ gap: 12 }}>
                        {candidaturas.map((candidatura) => {
                            const cfg = STATUS_CONFIG[candidatura.status];
                            const { Icon } = cfg;

                            return (
                                <View key={candidatura.id} style={styles.candidaturaCard}>
                                    {/* Topo: título + badge */}
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

                                        {/* Badge de status */}
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

                                    {/* Rodapé: data + botão */}
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