import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Award,
    Building,
    Calendar,
    ChevronDown,
    Clock,
    FileText,
    Plus,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import styles, { colors } from "../assets/style/estilo";
import { db } from "../config/firebase";
import { useUser } from "../context/UserContext";
import { AuthService } from "../services/AuthService";
import { Estudante } from "../models/Estudante";
import { Qualificacao } from "../models/Qualificacao";

interface OpcaoFirestore {
    id: string;
    nome: string;
}

function SelectFirestore({
    value,
    label,
    loading,
    opcoes,
    Icon,
    onChange,
}: {
    value: string;
    label: string;
    loading: boolean;
    opcoes: OpcaoFirestore[];
    Icon: React.ComponentType<{ size: number; color: string }>;
    onChange: (opcao: OpcaoFirestore) => void;
}) {
    const [open, setOpen] = useState(false);
    const selectedLabel = useMemo(
        () => opcoes.find((opcao) => opcao.id === value)?.nome ?? "Selecione",
        [opcoes, value]
    );

    return (
        <View style={{ gap: 6 }}>
            <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => {
                    if (!loading) setOpen(!open);
                }}
                activeOpacity={0.8}
                disabled={loading}
            >
                <Icon size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {loading ? `Carregando ${label.toLowerCase()}...` : selectedLabel}
                </Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#9ca3af" />
                ) : (
                    <ChevronDown size={18} color="#9ca3af" />
                )}
            </TouchableOpacity>

            {open && (
                <View style={styles.yearDropdown}>
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {opcoes.map((opcao) => (
                            <TouchableOpacity
                                key={opcao.id}
                                style={[
                                    styles.yearOption,
                                    value === opcao.id && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(opcao);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === opcao.id && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {opcao.nome}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export default function QualificacoesScreen() {
    const { usuario, setUsuario } = useUser();
    const [qualificacoes, setQualificacoes] = useState<Qualificacao[]>([]);
    const [tiposQualificacao, setTiposQualificacao] = useState<OpcaoFirestore[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        dt_inicio: "",
        dt_final: "",
        instituicao_escolaridade: "",
        carga_horaria: "",
        idTipoQualificacao: "",
        tipo: "",
    });

    const carregarEstudante = async () => {
        let estudanteLogado = usuario;
        const usuarioAtual = AuthService.usuarioAtual();

        if (!estudanteLogado && usuarioAtual?.uid) {
            estudanteLogado = await AuthService.buscarPerfil(usuarioAtual.uid);
            setUsuario(estudanteLogado);
        }

        if (!estudanteLogado || estudanteLogado.tipo !== "estudante") {
            return null;
        }

        return estudanteLogado as Estudante;
    };

    const carregarQualificacoes = async () => {
        setLoading(true);

        try {
            const estudante = await carregarEstudante();

            if (!estudante) {
                setQualificacoes([]);
                return;
            }

            const snapshot = await getDocs(
                query(collection(db, "qualificacoes"), where("idEstudante", "==", estudante.id))
            );
            const lista = snapshot.docs
                .map((documento) => new Qualificacao({ id: documento.id, ...documento.data() }))
                .sort((a, b) => a.titulo.localeCompare(b.titulo));

            setQualificacoes(lista);
        } catch (_) {
            Alert.alert("Erro", "Não foi possível carregar suas qualificações.");
            setQualificacoes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarQualificacoes();
    }, [usuario]);

    useEffect(() => {
        async function carregarTiposQualificacao() {
            try {
                const snapshot = await getDocs(collection(db, "tipo_qualificacao"));
                const lista = snapshot.docs
                    .map((documento) => {
                        const data = documento.data();

                        return {
                            id: documento.id,
                            nome: data.nome ?? data.descricao ?? data.tipo ?? documento.id,
                        };
                    })
                    .sort((a, b) => a.nome.localeCompare(b.nome));

                setTiposQualificacao(lista);
            } catch (_) {
                Alert.alert("Erro", "Não foi possível carregar os tipos de qualificação.");
            } finally {
                setLoadingTipos(false);
            }
        }

        carregarTiposQualificacao();
    }, []);

    const handleInputChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const apenasNumeros = (value: string) => value.replace(/\D/g, "");

    const handleData = (name: "dt_inicio" | "dt_final", value: string) => {
        const nums = apenasNumeros(value).slice(0, 8);
        let masked = nums;

        if (nums.length > 2) masked = `${nums.slice(0, 2)}/${nums.slice(2)}`;
        if (nums.length > 4) masked = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;

        handleInputChange(name, masked);
    };

    const campoVazio = (value: string) => !value.trim();

    const adicionarQualificacao = async () => {
        if (
            campoVazio(formData.titulo) ||
            campoVazio(formData.dt_inicio) ||
            campoVazio(formData.instituicao_escolaridade) ||
            !formData.idTipoQualificacao ||
            !formData.carga_horaria
        ) {
            Alert.alert("Atenção", "Preencha os dados obrigatórios da qualificação.");
            return;
        }

        const cargaHoraria = Number(formData.carga_horaria);

        if (Number.isNaN(cargaHoraria) || cargaHoraria <= 0) {
            Alert.alert("Atenção", "Informe uma carga horária válida.");
            return;
        }

        setSalvando(true);

        try {
            const estudante = await carregarEstudante();

            if (!estudante) {
                Alert.alert("Atenção", "Faça login como estudante para adicionar qualificações.");
                return;
            }

            const qualificacao = new Qualificacao({
                idEstudante: estudante.id,
                titulo: formData.titulo.trim(),
                dt_inicio: formData.dt_inicio,
                dt_final: formData.dt_final,
                idInstituicaoEscolaridade: "",
                instituicao_escolaridade: formData.instituicao_escolaridade,
                carga_horaria: cargaHoraria,
                idTipoQualificacao: formData.idTipoQualificacao,
                tipo: formData.tipo,
            });
            const docRef = await addDoc(collection(db, "qualificacoes"), qualificacao.toFirestore());

            await updateDoc(doc(db, "qualificacoes", docRef.id), { id: docRef.id });
            setFormData({
                titulo: "",
                dt_inicio: "",
                dt_final: "",
                instituicao_escolaridade: "",
                carga_horaria: "",
                idTipoQualificacao: "",
                tipo: "",
            });
            await carregarQualificacoes();
            Alert.alert("Sucesso!", "Qualificação adicionada com sucesso.");
        } catch (_) {
            Alert.alert("Erro", "Não foi possível adicionar a qualificação.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.screenHeaderTitle}>Qualificações</Text>
                    <Text style={styles.screenHeaderSubtitle}>
                        Cadastre cursos e certificações do seu perfil
                    </Text>
                </View>

                <View style={{ gap: 12, marginBottom: 20 }}>
                    {loading ? (
                        <View style={styles.emptyCard}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={[styles.emptySubtitle, { marginTop: 12 }]}>
                                Carregando qualificações...
                            </Text>
                        </View>
                    ) : qualificacoes.length > 0 ? (
                        qualificacoes.map((qualificacao) => (
                            <View key={qualificacao.id} style={styles.escolaridadeCard}>
                                <View style={{ flex: 1, gap: 4 }}>
                                    <Text
                                        style={[
                                            styles.escolaridadeText,
                                            { color: "#1e3a4f", fontWeight: "600" },
                                        ]}
                                    >
                                        {qualificacao.titulo}
                                    </Text>
                                    <Text style={styles.escolaridadeText}>
                                        {qualificacao.tipo} - {qualificacao.instituicao_escolaridade}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.escolaridadeText,
                                            { fontSize: 12, color: "#6b7280" },
                                        ]}
                                    >
                                        {qualificacao.dt_inicio}
                                        {qualificacao.dt_final ? ` até ${qualificacao.dt_final}` : ""} -{" "}
                                        {qualificacao.carga_horaria}h
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyCard}>
                            <View style={styles.emptyIconWrapper}>
                                <Award size={36} color={colors.labelMuted} />
                            </View>
                            <Text style={styles.emptyTitle}>Nenhuma qualificação adicionada</Text>
                            <Text style={styles.emptySubtitle}>
                                Suas qualificações aparecerão aqui depois do cadastro.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Adicionar Qualificação</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Título</Text>
                            <View style={styles.inputWrapper}>
                                <FileText size={20} color="#9ca3af" />
                                <TextInput
                                    placeholder="Ex: Curso de React Native"
                                    value={formData.titulo}
                                    onChangeText={(v) => handleInputChange("titulo", v)}
                                    style={styles.input}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tipo</Text>
                            <SelectFirestore
                                value={formData.idTipoQualificacao}
                                label="tipos"
                                loading={loadingTipos}
                                opcoes={tiposQualificacao}
                                Icon={Award}
                                onChange={(tipo) => {
                                    handleInputChange("idTipoQualificacao", tipo.id);
                                    handleInputChange("tipo", tipo.nome);
                                }}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Instituição de escolaridade</Text>
                            <View style={styles.inputWrapper}>
                                <Building size={20} color="#9ca3af" />
                                <TextInput
                                    placeholder="Nome da instituição"
                                    value={formData.instituicao_escolaridade}
                                    onChangeText={(v) =>
                                        handleInputChange("instituicao_escolaridade", v)
                                    }
                                    style={styles.input}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>Data início</Text>
                                <View style={[styles.inputWrapper, { flex: 1 }]}>
                                    <Calendar size={20} color="#9ca3af" />
                                    <TextInput
                                        placeholder="dd/mm/aaaa"
                                        value={formData.dt_inicio}
                                        onChangeText={(v) => handleData("dt_inicio", v)}
                                        style={styles.input}
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>Data final</Text>
                                <View style={[styles.inputWrapper, { flex: 1 }]}>
                                    <Calendar size={20} color="#9ca3af" />
                                    <TextInput
                                        placeholder="dd/mm/aaaa"
                                        value={formData.dt_final}
                                        onChangeText={(v) => handleData("dt_final", v)}
                                        style={styles.input}
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Carga horária</Text>
                            <View style={styles.inputWrapper}>
                                <Clock size={20} color="#9ca3af" />
                                <TextInput
                                    placeholder="Ex: 40"
                                    value={formData.carga_horaria}
                                    onChangeText={(v) => handleInputChange("carga_horaria", apenasNumeros(v))}
                                    style={styles.input}
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.buttonPrimary, salvando && styles.buttonDisabled]}
                            onPress={adicionarQualificacao}
                            disabled={salvando}
                            activeOpacity={0.8}
                        >
                            {salvando ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                    <Plus size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Adicionar</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
