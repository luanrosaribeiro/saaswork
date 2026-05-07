import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from "react-native";
import {
    User,
    Phone,
    Mail,
    Lock,
    MapPin,
    Hash,
    Building,
    GraduationCap,
    ChevronRight,
    ChevronLeft,
    Eye,
    EyeOff,
    ChevronDown,
    Building2,
    FileText,
    Plus,
    X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style/estilo";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from '../services/AuthService';
import { Aluno } from '../models/Aluno';
import { Instituicao } from '../models/Instituicao';
import { Endereco } from '../models/Endereco';
import { Escolaridade } from '../models/Escolaridade';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

type UserType = "aluno" | "instituicao" | null;

interface InstituicaoEscolaridade {
    id: string;
    nome: string;
}

interface NivelEscolaridade {
    id: string;
    nome: string;
}

const anoAtual = new Date().getFullYear();
const anos = Array.from({ length: anoAtual - 1969 }, (_, i) => String(anoAtual - i));

const ESTADOS_BR = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO",
    "MA","MT","MS","MG","PA","PB","PR","PE","PI",
    "RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

function getNivelLabel(value: string, niveis: NivelEscolaridade[]): string {
    return niveis.find((nivel) => nivel.id === value)?.nome ?? value;
}

function UserTypeSelection({ onSelectType }: { onSelectType: (t: UserType) => void }) {
    return (
        <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeTitle}>Como você quer se cadastrar?</Text>
            <Text style={styles.userTypeSubtitle}>Escolha seu perfil para continuar</Text>

            <TouchableOpacity
                style={styles.userTypeCard}
                onPress={() => onSelectType("aluno")}
                activeOpacity={0.8}
            >
                <View style={styles.userTypeIconWrapper}>
                    <GraduationCap size={32} color="#1e3a4f" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.userTypeCardTitle}>Sou Aluno</Text>
                    <Text style={styles.userTypeCardDesc}>Busco oportunidades de estágio</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.userTypeCard}
                onPress={() => onSelectType("instituicao")}
                activeOpacity={0.8}
            >
                <View style={styles.userTypeIconWrapper}>
                    <Building2 size={32} color="#1e3a4f" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.userTypeCardTitle}>Sou Instituição</Text>
                    <Text style={styles.userTypeCardDesc}>Quero publicar vagas de estágio</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
        </View>
    );
}

function YearPicker({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setOpen(!open)}
                activeOpacity={0.8}
            >
                <Hash size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {value || "Ano"}
                </Text>
                <ChevronDown size={18} color="#9ca3af" />
            </TouchableOpacity>

            {open && (
                <View style={styles.yearDropdown}>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {anos.map((ano) => (
                            <TouchableOpacity
                                key={ano}
                                style={[
                                    styles.yearOption,
                                    value === ano && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(ano);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === ano && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {ano}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

function NivelPicker({
    value,
    onChange,
    niveis,
    loading,
}: {
    value: string;
    onChange: (v: string) => void;
    niveis: NivelEscolaridade[];
    loading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const label = value ? getNivelLabel(value, niveis) : "Selecione";

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
                <GraduationCap size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {loading ? "Carregando níveis..." : label}
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
                        {niveis.map((nivel) => (
                            <TouchableOpacity
                                key={nivel.id}
                                style={[
                                    styles.yearOption,
                                    value === nivel.id && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(nivel.id);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === nivel.id && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {nivel.nome}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

function InstituicaoEscolaridadePicker({
    value,
    onChange,
    instituicoes,
    loading,
}: {
    value: string;
    onChange: (instituicao: InstituicaoEscolaridade) => void;
    instituicoes: InstituicaoEscolaridade[];
    loading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const label = instituicoes.find((instituicao) => instituicao.id === value)?.nome ?? "Selecione";

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
                <Building size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {loading ? "Carregando instituições..." : label}
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
                        {instituicoes.map((instituicao) => (
                            <TouchableOpacity
                                key={instituicao.id}
                                style={[
                                    styles.yearOption,
                                    value === instituicao.id && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(instituicao);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === instituicao.id && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {instituicao.nome}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

function EstadoPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>Estado</Text>
            <TouchableOpacity
                style={[styles.inputWrapper, { flex: 1 }]}
                onPress={() => setOpen(!open)}
                activeOpacity={0.8}
            >
                <MapPin size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {value || "UF"}
                </Text>
                <ChevronDown size={18} color="#9ca3af" />
            </TouchableOpacity>

            {open && (
                <View style={styles.yearDropdown}>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                        {ESTADOS_BR.map((uf) => (
                            <TouchableOpacity
                                key={uf}
                                style={[
                                    styles.yearOption,
                                    value === uf && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(uf);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === uf && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {uf}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export default function CadastroUser() {
    const navigation = useNavigation<any>();

    const [userType, setUserType] = useState<UserType>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingNiveis, setLoadingNiveis] = useState(true);
    const [loadingInstituicoes, setLoadingInstituicoes] = useState(true);
    const [niveisEscolaridade, setNiveisEscolaridade] = useState<NivelEscolaridade[]>([]);
    const [instituicoesEscolaridade, setInstituicoesEscolaridade] = useState<InstituicaoEscolaridade[]>([]);

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        senha: "",
        confirmaSenha: "",
        nomeEmpresa: "",
        cnpj: "",
        responsavel: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
    });

    const [escolaridades, setEscolaridades] = useState<Escolaridade[]>([]);
    const [escolaridadeAtual, setEscolaridadeAtual] = useState({
        nivelEscolaridade: "",
        idInstituicaoEscolaridade: "",
        instituicao: "",
        curso: "",
        anoInicio: "",
        anoConclusao: "",
    });

    const totalSteps = userType === "aluno" ? 3 : 2;

    const stepLabels =
        userType === "aluno"
            ? ["Dados Pessoais", "Endereço", "Escolaridade"]
            : ["Dados da Empresa", "Endereço"];

    const handleInputChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEscolaridadeChange = (
        name: keyof typeof escolaridadeAtual,
        value: string
    ) => {
        setEscolaridadeAtual((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        async function carregarNiveisEscolaridade() {
            try {
                const snapshot = await getDocs(collection(db, "niveis_escolaridades"));
                const lista: NivelEscolaridade[] = snapshot.docs
                    .map((doc) => {
                        const data = doc.data();

                        return {
                            id: doc.id,
                            nome: data.nome ?? data.descricao ?? data.label ?? doc.id,
                        };
                    })
                    .sort((a, b) => a.nome.localeCompare(b.nome));

                setNiveisEscolaridade(lista);
            } catch (_) {
                Alert.alert("Erro", "Não foi possível carregar os níveis de escolaridade.");
            } finally {
                setLoadingNiveis(false);
            }
        }

        carregarNiveisEscolaridade();
    }, []);

    useEffect(() => {
        async function carregarInstituicoesEscolaridade() {
            try {
                const snapshot = await getDocs(collection(db, "instituicao_escolaridade"));
                const lista: InstituicaoEscolaridade[] = snapshot.docs
                    .map((doc) => {
                        const data = doc.data();

                        return {
                            id: doc.id,
                            nome: data.nome ?? data.instituicao ?? data.descricao ?? doc.id,
                        };
                    })
                    .sort((a, b) => a.nome.localeCompare(b.nome));

                setInstituicoesEscolaridade(lista);
            } catch (_) {
                Alert.alert("Erro", "Não foi possível carregar as instituições.");
            } finally {
                setLoadingInstituicoes(false);
            }
        }

        carregarInstituicoesEscolaridade();
    }, []);

    const apenasNumeros = (value: string) => value.replace(/\D/g, "");

    const campoVazio = (value: string) => !value.trim();

    const emailValido = (email: string) => /\S+@\S+\.\S+/.test(email.trim());

    const validarDadosAcesso = () => {
        if (!emailValido(formData.email)) {
            Alert.alert("Atenção", "Informe um e-mail válido.");
            return false;
        }

        if (formData.senha.length < 6) {
            Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
            return false;
        }

        if (formData.senha !== formData.confirmaSenha) {
            Alert.alert("Atenção", "A senha e a confirmação precisam ser iguais.");
            return false;
        }

        return true;
    };

    const validarStepAtual = () => {
        if (userType === "aluno" && currentStep === 1) {
            if (campoVazio(formData.nome)) {
                Alert.alert("Atenção", "Informe seu nome completo.");
                return false;
            }

            if (apenasNumeros(formData.telefone).length < 10) {
                Alert.alert("Atenção", "Informe um telefone válido.");
                return false;
            }

            return validarDadosAcesso();
        }

        if (userType === "instituicao" && currentStep === 1) {
            if (campoVazio(formData.nomeEmpresa)) {
                Alert.alert("Atenção", "Informe o nome da empresa.");
                return false;
            }

            if (apenasNumeros(formData.cnpj).length !== 14) {
                Alert.alert("Atenção", "Informe um CNPJ válido.");
                return false;
            }

            if (campoVazio(formData.responsavel)) {
                Alert.alert("Atenção", "Informe o nome do responsável.");
                return false;
            }

            if (apenasNumeros(formData.telefone).length < 10) {
                Alert.alert("Atenção", "Informe um telefone válido.");
                return false;
            }

            return validarDadosAcesso();
        }

        if (currentStep === 2) {
            const camposObrigatorios = [
                formData.cep,
                formData.rua,
                formData.numero,
                formData.bairro,
                formData.cidade,
                formData.estado,
            ];

            if (apenasNumeros(formData.cep).length !== 8) {
                Alert.alert("Atenção", "Informe um CEP válido.");
                return false;
            }

            if (camposObrigatorios.some(campoVazio)) {
                Alert.alert("Atenção", "Preencha os campos obrigatórios do endereço.");
                return false;
            }
        }

        if (userType === "aluno" && currentStep === 3 && escolaridades.length === 0) {
            Alert.alert("Atenção", "Adicione pelo menos uma formação.");
            return false;
        }

        return true;
    };

    const handleTelefone = (value: string) => {
        const nums = apenasNumeros(value).slice(0, 11);
        let masked = nums;
        if (nums.length > 0) masked = `(${nums.slice(0, 2)}`;
        if (nums.length > 2) masked += `) ${nums.slice(2, 7)}`;
        if (nums.length > 7) masked += `-${nums.slice(7, 11)}`;
        handleInputChange("telefone", masked);
    };

    const handleCnpj = (value: string) => {
        const nums = apenasNumeros(value).slice(0, 14);
        let masked = nums;
        if (nums.length > 2)  masked = `${nums.slice(0,2)}.${nums.slice(2)}`;
        if (nums.length > 5)  masked = `${nums.slice(0,2)}.${nums.slice(2,5)}.${nums.slice(5)}`;
        if (nums.length > 8)  masked = `${nums.slice(0,2)}.${nums.slice(2,5)}.${nums.slice(5,8)}/${nums.slice(8)}`;
        if (nums.length > 12) masked = `${nums.slice(0,2)}.${nums.slice(2,5)}.${nums.slice(5,8)}/${nums.slice(8,12)}-${nums.slice(12)}`;
        handleInputChange("cnpj", masked);
    };

    const handleCep = async (value: string) => {
        const nums = apenasNumeros(value).slice(0, 8);
        let masked = nums;
        if (nums.length > 5) masked = `${nums.slice(0, 5)}-${nums.slice(5)}`;
        handleInputChange("cep", masked);

        if (nums.length === 8) {
            setLoadingCep(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${nums}/json/`);
                if (!res.ok) {
                    throw new Error("Falha ao consultar CEP.");
                }

                const data = await res.json();
                if (data.erro) {
                    Alert.alert("Atenção", "CEP não encontrado.");
                    return;
                }

                setFormData((prev) => ({
                    ...prev,
                    cep: masked,
                    rua: data.logradouro || "",
                    bairro: data.bairro || "",
                    cidade: data.localidade || "",
                    estado: data.uf || "",
                }));
            } catch (_) {
                Alert.alert("Atenção", "Não foi possível consultar o CEP agora.");
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const adicionarEscolaridade = () => {
        if (
            !escolaridadeAtual.nivelEscolaridade ||
            !escolaridadeAtual.idInstituicaoEscolaridade ||
            campoVazio(escolaridadeAtual.curso) ||
            !escolaridadeAtual.anoInicio
        ) {
            Alert.alert("Atenção", "Preencha os dados obrigatórios da formação.");
            return;
        }

        if (
            escolaridadeAtual.anoConclusao &&
            Number(escolaridadeAtual.anoConclusao) < Number(escolaridadeAtual.anoInicio)
        ) {
            Alert.alert("Atenção", "O ano de conclusão não pode ser menor que o ano de início.");
            return;
        }

        setEscolaridades((prev) => [
            ...prev,
            new Escolaridade({ id: Date.now().toString(), ...escolaridadeAtual }),
        ]);
        setEscolaridadeAtual({
            nivelEscolaridade: "",
            idInstituicaoEscolaridade: "",
            instituicao: "",
            curso: "",
            anoInicio: "",
            anoConclusao: "",
        });
    };

    const removerEscolaridade = (id: string) => {
        setEscolaridades((prev) => prev.filter((e) => e.id !== id));
    };

    const handleAvancar = async () => {
        if (!validarStepAtual()) {
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            return;
        }

        // ── Último step: dispara o cadastro ──────────────────────────────────────
        setLoading(true);
        try {
            const endereco = new Endereco({
                cep: formData.cep,
                rua: formData.rua,
                numero: formData.numero,
                complemento: formData.complemento,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
            });

            let usuario: Aluno | Instituicao;

            if (userType === 'aluno') {
                usuario = new Aluno({
                    nome: formData.nome.trim(),
                    email: formData.email.trim(),
                    telefone: formData.telefone,
                    endereco,
                    escolaridades: escolaridades.map((e) => new Escolaridade(e)),
                });
            } else {
                usuario = new Instituicao({
                    nome: formData.responsavel.trim(),
                    email: formData.email.trim(),
                    telefone: formData.telefone,
                    endereco,
                    nomeEmpresa: formData.nomeEmpresa.trim(),
                    cnpj: formData.cnpj,
                    responsavel: formData.responsavel.trim(),
                });
            }

            await AuthService.cadastrar(formData.email.trim(), formData.senha, usuario);

            Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.');
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

        } catch (error: any) {
            // Tradução dos erros mais comuns do Firebase
            const mensagens: Record<string, string> = {
            'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
            'auth/invalid-email': 'E-mail inválido.',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
            };

            const msg = mensagens[error?.code] ?? 'Erro ao cadastrar. Tente novamente.';
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
        };

    const canFinish =
        currentStep === totalSteps &&
        (userType !== "aluno" || escolaridades.length > 0);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../assets/images/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.subtitle}>Encontre seu estágio ideal</Text>
                    </View>

                    <View style={styles.card}>
                        {/* ── Seleção de tipo de usuário ── */}
                        {!userType ? (
                            <UserTypeSelection onSelectType={setUserType} />
                        ) : (
                            <>
                                {/* ── Step indicator ── */}
                                <View style={styles.stepsRow}>
                                    {stepLabels.map((label, index) => {
                                        const stepNum = index + 1;
                                        const isActive = currentStep === stepNum;
                                        const isDone = currentStep > stepNum;
                                        return (
                                            <View key={stepNum} style={styles.stepItem}>
                                                {index > 0 && (
                                                    <View
                                                        style={[
                                                            styles.connector,
                                                            (isDone || isActive) && styles.connectorDone,
                                                        ]}
                                                    />
                                                )}
                                                <View
                                                    style={[
                                                        styles.circle,
                                                        (isActive || isDone) && styles.circleActive,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.circleText,
                                                            (isActive || isDone) && styles.circleTextActive,
                                                        ]}
                                                    >
                                                        {stepNum}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.stepLabel,
                                                        isActive && styles.stepLabelActive,
                                                    ]}
                                                >
                                                    {label}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                <Text style={styles.title}>
                                    {userType === "aluno"
                                        ? "Complete seu cadastro"
                                        : "Cadastro de Instituição"}
                                </Text>

                                <View style={styles.form}>
                                    {/* ══ STEP 1 — Aluno ══ */}
                                    {currentStep === 1 && userType === "aluno" && (
                                        <>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Nome Completo</Text>
                                                <View style={styles.inputWrapper}>
                                                    <User size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Seu nome completo"
                                                        value={formData.nome}
                                                        onChangeText={(v) => handleInputChange("nome", v)}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Telefone</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Phone size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="(00) 00000-0000"
                                                        value={formData.telefone}
                                                        onChangeText={handleTelefone}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Email</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Mail size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="seu.email@exemplo.com"
                                                        value={formData.email}
                                                        onChangeText={(v) => handleInputChange("email", v)}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Senha</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Lock size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="••••••••"
                                                        value={formData.senha}
                                                        onChangeText={(v) => handleInputChange("senha", v)}
                                                        secureTextEntry={!showSenha}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                    <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
                                                        {showSenha ? (
                                                            <EyeOff size={20} color="#9ca3af" />
                                                        ) : (
                                                            <Eye size={20} color="#9ca3af" />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Confirmar Senha</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Lock size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="••••••••"
                                                        value={formData.confirmaSenha}
                                                        onChangeText={(v) =>
                                                            handleInputChange("confirmaSenha", v)
                                                        }
                                                        secureTextEntry={!showConfirmaSenha}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowConfirmaSenha(!showConfirmaSenha)
                                                        }
                                                    >
                                                        {showConfirmaSenha ? (
                                                            <EyeOff size={20} color="#9ca3af" />
                                                        ) : (
                                                            <Eye size={20} color="#9ca3af" />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </>
                                    )}

                                    {/* ══ STEP 1 — Instituição ══ */}
                                    {currentStep === 1 && userType === "instituicao" && (
                                        <>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Nome da Empresa</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Building2 size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Nome da empresa"
                                                        value={formData.nomeEmpresa}
                                                        onChangeText={(v) =>
                                                            handleInputChange("nomeEmpresa", v)
                                                        }
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>CNPJ</Text>
                                                <View style={styles.inputWrapper}>
                                                    <FileText size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="00.000.000/0000-00"
                                                        value={formData.cnpj}
                                                        onChangeText={handleCnpj}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Responsável</Text>
                                                <View style={styles.inputWrapper}>
                                                    <User size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Nome do responsável"
                                                        value={formData.responsavel}
                                                        onChangeText={(v) =>
                                                            handleInputChange("responsavel", v)
                                                        }
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Telefone</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Phone size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="(00) 00000-0000"
                                                        value={formData.telefone}
                                                        onChangeText={handleTelefone}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Email</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Mail size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="contato@empresa.com"
                                                        value={formData.email}
                                                        onChangeText={(v) => handleInputChange("email", v)}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Senha</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Lock size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="••••••••"
                                                        value={formData.senha}
                                                        onChangeText={(v) => handleInputChange("senha", v)}
                                                        secureTextEntry={!showSenha}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                    <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
                                                        {showSenha ? (
                                                            <EyeOff size={20} color="#9ca3af" />
                                                        ) : (
                                                            <Eye size={20} color="#9ca3af" />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Confirmar Senha</Text>
                                                <View style={styles.inputWrapper}>
                                                    <Lock size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="••••••••"
                                                        value={formData.confirmaSenha}
                                                        onChangeText={(v) =>
                                                            handleInputChange("confirmaSenha", v)
                                                        }
                                                        secureTextEntry={!showConfirmaSenha}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowConfirmaSenha(!showConfirmaSenha)
                                                        }
                                                    >
                                                        {showConfirmaSenha ? (
                                                            <EyeOff size={20} color="#9ca3af" />
                                                        ) : (
                                                            <Eye size={20} color="#9ca3af" />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </>
                                    )}

                                    {/* ══ STEP 2 — Endereço (ambos os tipos) ══ */}
                                    {currentStep === 2 && (
                                        <>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>CEP</Text>
                                                <View style={styles.inputWrapper}>
                                                    <MapPin size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="00000-000"
                                                        value={formData.cep}
                                                        onChangeText={handleCep}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="numeric"
                                                    />
                                                    {loadingCep && (
                                                        <ActivityIndicator size="small" color="#9ca3af" />
                                                    )}
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Rua</Text>
                                                <View style={styles.inputWrapper}>
                                                    <MapPin size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Nome da rua"
                                                        value={formData.rua}
                                                        onChangeText={(v) => handleInputChange("rua", v)}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputRow}>
                                                <View style={styles.inputHalf}>
                                                    <Text style={styles.label}>Número</Text>
                                                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                                                        <Hash size={20} color="#9ca3af" />
                                                        <TextInput
                                                            placeholder="000"
                                                            value={formData.numero}
                                                            onChangeText={(v) =>
                                                                handleInputChange("numero", v.replace(/\D/g, ""))
                                                            }
                                                            style={styles.input}
                                                            placeholderTextColor="#9ca3af"
                                                            keyboardType="numeric"
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.inputHalf}>
                                                    <Text style={styles.label}>Complemento</Text>
                                                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                                                        <Building size={20} color="#9ca3af" />
                                                        <TextInput
                                                            placeholder="Apto, bloco..."
                                                            value={formData.complemento}
                                                            onChangeText={(v) =>
                                                                handleInputChange("complemento", v)
                                                            }
                                                            style={styles.input}
                                                            placeholderTextColor="#9ca3af"
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Bairro</Text>
                                                <View style={styles.inputWrapper}>
                                                    <MapPin size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Seu bairro"
                                                        value={formData.bairro}
                                                        onChangeText={(v) => handleInputChange("bairro", v)}
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputRow}>
                                                <View style={styles.inputHalf}>
                                                    <Text style={styles.label}>Cidade</Text>
                                                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                                                        <Building size={20} color="#9ca3af" />
                                                        <TextInput
                                                            placeholder="Sua cidade"
                                                            value={formData.cidade}
                                                            onChangeText={(v) =>
                                                                handleInputChange("cidade", v)
                                                            }
                                                            style={styles.input}
                                                            placeholderTextColor="#9ca3af"
                                                        />
                                                    </View>
                                                </View>

                                                <EstadoPicker
                                                    value={formData.estado}
                                                    onChange={(v) => handleInputChange("estado", v)}
                                                />
                                            </View>
                                        </>
                                    )}

                                    {/* ══ STEP 3 — Escolaridade (apenas aluno) ══ */}
                                    {currentStep === 3 && userType === "aluno" && (
                                        <>
                                            {/* Lista de escolaridades já adicionadas */}
                                            {escolaridades.length > 0 && (
                                                <View style={{ gap: 8, marginBottom: 8 }}>
                                                    <Text style={styles.sectionLabel}>
                                                        Formações Adicionadas:
                                                    </Text>
                                                    {escolaridades.map((e) => (
                                                        <View key={e.id} style={styles.escolaridadeCard}>
                                                            <View style={{ flex: 1 }}>
                                                                <Text
                                                                    style={[
                                                                        styles.escolaridadeText,
                                                                        { color: "#1e3a4f", fontWeight: "600" },
                                                                    ]}
                                                                >
                                                                    {getNivelLabel(e.nivelEscolaridade, niveisEscolaridade)}
                                                                </Text>
                                                                <Text style={styles.escolaridadeText}>
                                                                    {e.curso} — {e.instituicao}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.escolaridadeText,
                                                                        { fontSize: 12, color: "#6b7280" },
                                                                    ]}
                                                                >
                                                                    {e.anoInicio} →{" "}
                                                                    {e.anoConclusao || "Cursando"}
                                                                </Text>
                                                            </View>
                                                            <TouchableOpacity
                                                                onPress={() => removerEscolaridade(e.id)}
                                                                style={styles.removeButton}
                                                            >
                                                                <X size={16} color="#9ca3af" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Formulário de nova escolaridade */}
                                            <View style={styles.sectionDivider} />
                                            <Text style={styles.sectionLabel}>
                                                {escolaridades.length > 0
                                                    ? "Adicionar Nova Formação:"
                                                    : "Adicionar Formação:"}
                                            </Text>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Nível de Escolaridade</Text>
                                                <NivelPicker
                                                    value={escolaridadeAtual.nivelEscolaridade}
                                                    onChange={(v) =>
                                                        handleEscolaridadeChange("nivelEscolaridade", v)
                                                    }
                                                    niveis={niveisEscolaridade}
                                                    loading={loadingNiveis}
                                                />
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Instituição</Text>
                                                <InstituicaoEscolaridadePicker
                                                    value={escolaridadeAtual.idInstituicaoEscolaridade}
                                                    onChange={(instituicao) => {
                                                        handleEscolaridadeChange("idInstituicaoEscolaridade", instituicao.id);
                                                        handleEscolaridadeChange("instituicao", instituicao.nome);
                                                    }}
                                                    instituicoes={instituicoesEscolaridade}
                                                    loading={loadingInstituicoes}
                                                />
                                            </View>

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Curso</Text>
                                                <View style={styles.inputWrapper}>
                                                    <GraduationCap size={20} color="#9ca3af" />
                                                    <TextInput
                                                        placeholder="Nome do curso"
                                                        value={escolaridadeAtual.curso}
                                                        onChangeText={(v) =>
                                                            handleEscolaridadeChange("curso", v)
                                                        }
                                                        style={styles.input}
                                                        placeholderTextColor="#9ca3af"
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.inputRow}>
                                                <YearPicker
                                                    label="Ano Início"
                                                    value={escolaridadeAtual.anoInicio}
                                                    onChange={(v) =>
                                                        handleEscolaridadeChange("anoInicio", v)
                                                    }
                                                />
                                                <YearPicker
                                                    label="Ano Conclusão"
                                                    value={escolaridadeAtual.anoConclusao}
                                                    onChange={(v) =>
                                                        handleEscolaridadeChange("anoConclusao", v)
                                                    }
                                                />
                                            </View>

                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={adicionarEscolaridade}
                                            >
                                                <Plus size={18} color="#374151" />
                                                <Text style={styles.addButtonText}>
                                                    Adicionar Formação
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {/* ── Botões de navegação ── */}
                                    <View style={styles.buttonsContainer}>
                                        <TouchableOpacity
                                            style={styles.buttonSecondary}
                                            onPress={() => {
                                                if (currentStep > 1) {
                                                    setCurrentStep(currentStep - 1);
                                                } else {
                                                    // Volta para seleção de tipo
                                                    setUserType(null);
                                                    setCurrentStep(1);
                                                }
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                                <ChevronLeft size={18} color="#374151" />
                                                <Text style={styles.buttonTextSecondary}>Voltar</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                        style={[
                                            styles.buttonPrimary,
                                            currentStep === totalSteps && !canFinish && styles.buttonDisabled,
                                        ]}
                                        onPress={handleAvancar}
                                        disabled={(currentStep === totalSteps && !canFinish) || loading}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                {loading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                <>
                                                    <Text style={styles.buttonText}>
                                                    {currentStep < totalSteps ? 'Avançar' : 'Finalizar'}
                                                    </Text>
                                                    {currentStep < totalSteps && (
                                                    <ChevronRight size={18} color="#fff" />
                                                    )}
                                                </>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Já tem uma conta? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                            <Text style={styles.footerLink}>Fazer login</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
