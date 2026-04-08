import React, { useState } from "react";
import {
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
    MapPin,
    Clock,
    DollarSign,
    Building2,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles, { colors } from "../assets/style/estilo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vaga {
    id: string;
    titulo: string;
    descricao: string;
    instituicao: string;
    localizacao: string;
    tipo: string;
    salario?: string;
    publicadoEm: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const VAGAS: Vaga[] = [
    {
        id: "1",
        titulo: "Desenvolvedor Front-end",
        descricao:
            "Buscamos desenvolvedor Front-end com experiência em React, TypeScript e Tailwind CSS para atuar em projetos inovadores.",
        instituicao: "Tech Solutions",
        localizacao: "São Paulo, SP",
        tipo: "CLT",
        salario: "R$ 8.000 - R$ 12.000",
        publicadoEm: "Há 2 dias",
    },
    {
        id: "2",
        titulo: "Designer UI/UX",
        descricao:
            "Procuramos designer UI/UX criativo para desenvolver interfaces intuitivas e experiências excepcionais.",
        instituicao: "Creative Studio",
        localizacao: "Rio de Janeiro, RJ",
        tipo: "PJ",
        salario: "R$ 6.000 - R$ 9.000",
        publicadoEm: "Há 3 dias",
    },
    {
        id: "3",
        titulo: "Analista de Marketing Digital",
        descricao:
            "Vaga para analista com experiência em campanhas de marketing digital, SEO, SEM e análise de métricas.",
        instituicao: "Marketing Pro",
        localizacao: "Belo Horizonte, MG",
        tipo: "CLT",
        salario: "R$ 5.000 - R$ 7.000",
        publicadoEm: "Há 5 dias",
    },
    {
        id: "4",
        titulo: "Engenheiro de Software",
        descricao:
            "Oportunidade para engenheiro de software sênior com conhecimento em arquitetura de sistemas e cloud computing.",
        instituicao: "Cloud Systems",
        localizacao: "Remoto",
        tipo: "CLT",
        salario: "R$ 15.000 - R$ 20.000",
        publicadoEm: "Há 1 semana",
    },
    {
        id: "5",
        titulo: "Product Manager",
        descricao:
            "Buscamos Product Manager experiente para liderar o desenvolvimento de produtos digitais inovadores.",
        instituicao: "StartupXYZ",
        localizacao: "Curitiba, PR",
        tipo: "CLT",
        salario: "R$ 12.000 - R$ 18.000",
        publicadoEm: "Há 1 semana",
    },
];

// ─── JobCard ──────────────────────────────────────────────────────────────────

interface JobCardProps extends Vaga {
    onCandidatar: (id: string) => void;
}

function JobCard({
    id,
    titulo,
    descricao,
    instituicao,
    localizacao,
    tipo,
    salario,
    publicadoEm,
    onCandidatar,
}: JobCardProps) {
    return (
        <View style={styles.jobCard}>
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

            {/* Descrição com limite de 2 linhas */}
            <Text style={styles.jobDescription} numberOfLines={2}>
                {descricao}
            </Text>

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

            {/* Rodapé */}
            <View style={styles.jobCardFooter}>
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
    );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const [search, setSearch] = useState("");
    const notificacoes = 3;

    const vagasFiltradas = VAGAS.filter(
        (v) =>
            v.titulo.toLowerCase().includes(search.toLowerCase()) ||
            v.instituicao.toLowerCase().includes(search.toLowerCase())
    );

    const handleCandidatar = (id: string) => {
        console.log("Candidatar vaga:", id);
        // Navegue ou exiba modal de confirmação aqui
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

                <View style={{ gap: 12 }}>
                    {vagasFiltradas.map((vaga) => (
                        <JobCard
                            key={vaga.id}
                            {...vaga}
                            onCandidatar={handleCandidatar}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}