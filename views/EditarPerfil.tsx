import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Building,
    Building2,
    Calendar,
    FileText,
    Hash,
    MapPin,
    Phone,
    Save,
    User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/style/estilo";
import { useUser } from "../context/UserContext";
import { Estudante } from "../models/Estudante";
import { Empresa } from "../models/Empresa";
import { Endereco } from "../models/Endereco";
import { UserService } from "../services/UserService";
import EstadoPicker from "../components/EstadoPicker";

export default function EditarPerfilScreen() {
    const navigation = useNavigation<any>();
    const { usuario, setUsuario } = useUser();
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);

    const isEstudante = usuario?.tipo === "estudante";
    const estudante = isEstudante ? (usuario as Estudante) : null;
    const empresa = !isEstudante ? (usuario as Empresa) : null;

    const [formData, setFormData] = useState({
        nome: usuario?.nome ?? "",
        telefone: usuario?.telefone ?? "",
        nomeEmpresa: empresa?.nomeEmpresa ?? "",
        cnpj: empresa?.cnpj ?? "",
        responsavel: empresa?.responsavel ?? "",
        cpf: estudante?.cpf ?? "",
        dt_nascimento: estudante?.dt_nascimento ?? "",
        cep: usuario?.endereco?.cep ?? "",
        rua: usuario?.endereco?.rua ?? "",
        numero: usuario?.endereco?.numero ?? "",
        complemento: usuario?.endereco?.complemento ?? "",
        bairro: usuario?.endereco?.bairro ?? "",
        cidade: usuario?.endereco?.cidade ?? "",
        estado: usuario?.endereco?.estado ?? "",
    });

    const handleInputChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const apenasNumeros = (value: string) => value.replace(/\D/g, "");
    const campoVazio = (value: string) => !value.trim();

    const handleTelefone = (value: string) => {
        const nums = apenasNumeros(value).slice(0, 11);
        let masked = nums;
        if (nums.length > 0) masked = `(${nums.slice(0, 2)}`;
        if (nums.length > 2) masked += `) ${nums.slice(2, 7)}`;
        if (nums.length > 7) masked += `-${nums.slice(7, 11)}`;
        handleInputChange("telefone", masked);
    };

    const handleCpf = (value: string) => {
        const nums = apenasNumeros(value).slice(0, 11);
        let masked = nums;
        if (nums.length > 3) masked = `${nums.slice(0, 3)}.${nums.slice(3)}`;
        if (nums.length > 6) masked = `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
        if (nums.length > 9) masked = `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
        handleInputChange("cpf", masked);
    };

    const handleDataNascimento = (value: string) => {
        const nums = apenasNumeros(value).slice(0, 8);
        let masked = nums;
        if (nums.length > 2) masked = `${nums.slice(0, 2)}/${nums.slice(2)}`;
        if (nums.length > 4) masked = `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
        handleInputChange("dt_nascimento", masked);
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
                if (!res.ok) throw new Error("Falha ao consultar CEP.");
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
            } catch {
                Alert.alert("Atenção", "Não foi possível consultar o CEP agora.");
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const validar = () => {
        if (campoVazio(formData.nome)) {
            Alert.alert("Atenção", "Informe seu nome.");
            return false;
        }

        if (apenasNumeros(formData.telefone).length < 10) {
            Alert.alert("Atenção", "Informe um telefone válido.");
            return false;
        }

        if (!isEstudante) {
            if (campoVazio(formData.nomeEmpresa)) {
                Alert.alert("Atenção", "Informe o nome da empresa.");
                return false;
            }
            if (apenasNumeros(formData.cnpj).length !== 14) {
                Alert.alert("Atenção", "Informe um CNPJ válido.");
                return false;
            }
        }

        if (apenasNumeros(formData.cep).length !== 8) {
            Alert.alert("Atenção", "Informe um CEP válido.");
            return false;
        }

        const camposEndereco = [formData.rua, formData.numero, formData.bairro, formData.cidade, formData.estado];
        if (camposEndereco.some(campoVazio)) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios do endereço.");
            return false;
        }

        return true;
    };

    const handleSalvar = async () => {
        if (!validar() || !usuario) return;

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

            let usuarioAtualizado: Estudante | Empresa;

            if (isEstudante && estudante) {
                usuarioAtualizado = new Estudante({
                    ...estudante,
                    nome: formData.nome.trim(),
                    telefone: formData.telefone,
                    cpf: formData.cpf,
                    dt_nascimento: formData.dt_nascimento,
                    endereco,
                });
            } else {
                usuarioAtualizado = new Empresa({
                    ...(empresa as Empresa),
                    nome: formData.responsavel.trim(),
                    telefone: formData.telefone,
                    nomeEmpresa: formData.nomeEmpresa.trim(),
                    cnpj: formData.cnpj,
                    responsavel: formData.responsavel.trim(),
                    endereco,
                });
            }

            await UserService.atualizar(usuario.id, usuarioAtualizado);
            setUsuario(usuarioAtualizado);

            Alert.alert("Sucesso!", "Dados atualizados com sucesso.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert("Erro", error?.message ?? "Não foi possível atualizar os dados.");
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return null;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.screenContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginBottom: 16 }}>
                        <Text style={styles.screenHeaderTitle}>Editar Perfil</Text>
                        <Text style={styles.screenHeaderSubtitle}>Atualize seus dados</Text>
                    </View>

                    <View style={[styles.candidaturaCard, { gap: 16, marginBottom: 12 }]}>
                        <Text style={styles.candidaturaTitle}>
                            {isEstudante ? "Dados pessoais" : "Dados da empresa"}
                        </Text>

                        {isEstudante ? (
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
                                    <Text style={styles.label}>CPF</Text>
                                    <View style={styles.inputWrapper}>
                                        <FileText size={20} color="#9ca3af" />
                                        <TextInput
                                            placeholder="000.000.000-00"
                                            value={formData.cpf}
                                            onChangeText={handleCpf}
                                            style={styles.input}
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Data de Nascimento</Text>
                                    <View style={styles.inputWrapper}>
                                        <Calendar size={20} color="#9ca3af" />
                                        <TextInput
                                            placeholder="dd/mm/aaaa"
                                            value={formData.dt_nascimento}
                                            onChangeText={handleDataNascimento}
                                            style={styles.input}
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nome da Empresa</Text>
                                    <View style={styles.inputWrapper}>
                                        <Building2 size={20} color="#9ca3af" />
                                        <TextInput
                                            placeholder="Nome da empresa"
                                            value={formData.nomeEmpresa}
                                            onChangeText={(v) => handleInputChange("nomeEmpresa", v)}
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
                                            onChangeText={(v) => handleInputChange("responsavel", v)}
                                            style={styles.input}
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                </View>
                            </>
                        )}

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
                    </View>

                    <View style={[styles.candidaturaCard, { gap: 16, marginBottom: 12 }]}>
                        <Text style={styles.candidaturaTitle}>Endereço</Text>

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

                            <EstadoPicker
                                value={formData.estado}
                                onChange={(v) => handleInputChange("estado", v)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.buttonPrimary, { flex: 0, marginTop: 8 }, loading && styles.buttonDisabled]}
                        onPress={handleSalvar}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <Save size={18} color="#fff" />
                                <Text style={styles.buttonText}>Salvar alterações</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}