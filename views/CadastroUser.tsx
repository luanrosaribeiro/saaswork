import React, { useState } from "react";
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
    Eye,
    EyeOff,
    ChevronDown,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style/estilo";
import { useNavigation } from "@react-navigation/native";

interface Escolaridade {
    id: string;
    nivelEscolaridade: string;
    instituicao: string;
    curso: string;
    anoInicio: string;
    anoConclusao: string;
}


const anoAtual = new Date().getFullYear();
const anos = Array.from({ length: anoAtual - 1969 }, (_, i) => String(anoAtual - i));

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

export default function CadastroUser() {
    const navigation = useNavigation<any>();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        senha: "",
        confirmaSenha: "",
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
        instituicao: "",
        curso: "",
        anoInicio: "",
        anoConclusao: "",
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleEscolaridadeChange = (name: string, value: string) => {
        setEscolaridadeAtual({ ...escolaridadeAtual, [name]: value });
    };

    const handleTelefone = (value: string) => {
        const nums = value.replace(/\D/g, "").slice(0, 11);
        let masked = nums;
        if (nums.length > 0) masked = `(${nums.slice(0, 2)}`;
        if (nums.length > 2) masked += `) ${nums.slice(2, 7)}`;
        if (nums.length > 7) masked += `-${nums.slice(7, 11)}`;
        handleInputChange("telefone", masked);
    };

    const handleCep = async (value: string) => {
        const nums = value.replace(/\D/g, "").slice(0, 8);
        let masked = nums;
        if (nums.length > 5) masked = `${nums.slice(0, 5)}-${nums.slice(5)}`;
        handleInputChange("cep", masked);

        if (nums.length === 8) {
            setLoadingCep(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${nums}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData((prev) => ({
                        ...prev,
                        cep: masked,
                        rua: data.logradouro || "",
                        bairro: data.bairro || "",
                        cidade: data.localidade || "",
                        estado: data.uf || "",
                    }));
                }
            } catch (_) { }
            setLoadingCep(false);
        }
    };

    const adicionarEscolaridade = () => {
        if (
            escolaridadeAtual.nivelEscolaridade &&
            escolaridadeAtual.instituicao &&
            escolaridadeAtual.curso &&
            escolaridadeAtual.anoInicio
        ) {
            setEscolaridades([
                ...escolaridades,
                { id: Date.now().toString(), ...escolaridadeAtual },
            ]);
            setEscolaridadeAtual({
                nivelEscolaridade: "",
                instituicao: "",
                curso: "",
                anoInicio: "",
                anoConclusao: "",
            });
        }
    };

    const handleAvancar = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
        else console.log("Finalizar cadastro:", { formData, escolaridades });
    };

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
                        <View style={styles.stepsRow}>
                            {[
                                { number: 1, label: "Dados Pessoais" },
                                { number: 2, label: "Endereço" },
                                { number: 3, label: "Escolaridade" },
                            ].map((step, index) => {
                                const isActive = currentStep === step.number;
                                const isDone = currentStep > step.number;
                                return (
                                    <View key={step.number} style={styles.stepItem}>
                                        {index > 0 && (
                                            <View
                                                style={[
                                                    styles.connector,
                                                    (isDone || isActive) && styles.connectorDone,
                                                ]}
                                            />
                                        )}
                                        <View style={[styles.circle, (isActive || isDone) && styles.circleActive]}>
                                            <Text style={[styles.circleText, (isActive || isDone) && styles.circleTextActive]}>
                                                {step.number}
                                            </Text>
                                        </View>
                                        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                                            {step.label}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <Text style={styles.title}>Complete seu cadastro</Text>

                        <View style={styles.form}>

                            {currentStep === 1 && (
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
                                                {showSenha ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
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
                                                onChangeText={(v) => handleInputChange("confirmaSenha", v)}
                                                secureTextEntry={!showConfirmaSenha}
                                                style={styles.input}
                                                placeholderTextColor="#9ca3af"
                                            />
                                            <TouchableOpacity onPress={() => setShowConfirmaSenha(!showConfirmaSenha)}>
                                                {showConfirmaSenha ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}

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
                                            {loadingCep && <ActivityIndicator size="small" color="#9ca3af" />}
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
                                                    onChangeText={(v) => handleInputChange("numero", v.replace(/\D/g, ""))}
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
                                                    onChangeText={(v) => handleInputChange("complemento", v)}
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
                                                    onChangeText={(v) => handleInputChange("cidade", v)}
                                                    style={styles.input}
                                                    placeholderTextColor="#9ca3af"
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputHalf}>
                                            <Text style={styles.label}>Estado</Text>
                                            <View style={[styles.inputWrapper, { flex: 1 }]}>
                                                <MapPin size={20} color="#9ca3af" />
                                                <TextInput
                                                    placeholder="UF"
                                                    value={formData.estado}
                                                    onChangeText={(v) => handleInputChange("estado", v)}
                                                    style={styles.input}
                                                    placeholderTextColor="#9ca3af"
                                                    maxLength={2}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Nível de Escolaridade</Text>
                                        <View style={styles.inputWrapper}>
                                            <GraduationCap size={20} color="#9ca3af" />
                                            <TextInput
                                                placeholder="Ex: Graduação, Ensino Médio..."
                                                value={escolaridadeAtual.nivelEscolaridade}
                                                onChangeText={(v) => handleEscolaridadeChange("nivelEscolaridade", v)}
                                                style={styles.input}
                                                placeholderTextColor="#9ca3af"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Instituição</Text>
                                        <View style={styles.inputWrapper}>
                                            <Building size={20} color="#9ca3af" />
                                            <TextInput
                                                placeholder="Nome da instituição"
                                                value={escolaridadeAtual.instituicao}
                                                onChangeText={(v) => handleEscolaridadeChange("instituicao", v)}
                                                style={styles.input}
                                                placeholderTextColor="#9ca3af"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Curso</Text>
                                        <View style={styles.inputWrapper}>
                                            <GraduationCap size={20} color="#9ca3af" />
                                            <TextInput
                                                placeholder="Nome do curso"
                                                value={escolaridadeAtual.curso}
                                                onChangeText={(v) => handleEscolaridadeChange("curso", v)}
                                                style={styles.input}
                                                placeholderTextColor="#9ca3af"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputRow}>
                                        <YearPicker
                                            label="Ano Início"
                                            value={escolaridadeAtual.anoInicio}
                                            onChange={(v) => handleEscolaridadeChange("anoInicio", v)}
                                        />
                                        <YearPicker
                                            label="Ano Conclusão"
                                            value={escolaridadeAtual.anoConclusao}
                                            onChange={(v) => handleEscolaridadeChange("anoConclusao", v)}
                                        />
                                    </View>

                                    {escolaridades.map((e) => (
                                        <View key={e.id} style={styles.escolaridadeCard}>
                                            <Text style={styles.escolaridadeText}>{e.nivelEscolaridade} — {e.curso}</Text>
                                            <Text style={styles.escolaridadeText}>{e.instituicao}</Text>
                                            <Text style={styles.escolaridadeText}>{e.anoInicio} → {e.anoConclusao || "cursando"}</Text>
                                        </View>
                                    ))}

                                    <TouchableOpacity style={styles.addButton} onPress={adicionarEscolaridade}>
                                        <Text style={styles.addButtonText}>+ Adicionar escolaridade</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <View style={styles.buttonsContainer}>
                                {currentStep > 1 && (
                                    <TouchableOpacity
                                        style={styles.buttonSecondary}
                                        onPress={() => setCurrentStep(currentStep - 1)}
                                    >
                                        <Text style={styles.buttonTextSecondary}>Voltar</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.buttonPrimary} onPress={handleAvancar}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                        <Text style={styles.buttonText}>
                                            {currentStep < 3 ? "Avançar" : "Finalizar"}
                                        </Text>
                                        {currentStep < 3 && <ChevronRight size={18} color="#fff" />}
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}