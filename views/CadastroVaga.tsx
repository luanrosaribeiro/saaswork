import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";
import {
    FileText,
    Clock,
    ChevronDown,
    Briefcase,
    AlignLeft,
    CheckSquare,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style/estilo";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Vaga } from "../models/Vaga";
import { useUser } from "../context/UserContext";

// ── Tipo auxiliar para os documentos de TipoVaga do Firestore ────────────────
interface TipoVaga {
    id: string;
    descricao: string;
}

// ── Picker de Tipo de Vaga ────────────────────────────────────────────────────
function TipoVagaPicker({
    value,
    onChange,
    tipos,
}: {
    value: string;
    onChange: (v: string) => void;
    tipos: TipoVaga[];
}) {
    const [open, setOpen] = useState(false);
    const label = tipos.find((t) => t.id === value)?.descricao ?? "Selecione";

    return (
        <View style={{ gap: 6 }}>
            <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setOpen(!open)}
                activeOpacity={0.8}
            >
                <Briefcase size={20} color="#9ca3af" />
                <Text style={[styles.input, { color: value ? "#374151" : "#9ca3af" }]}>
                    {label}
                </Text>
                <ChevronDown size={18} color="#9ca3af" />
            </TouchableOpacity>

            {open && (
                <View style={styles.yearDropdown}>
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {tipos.map((tipo) => (
                            <TouchableOpacity
                                key={tipo.id}
                                style={[
                                    styles.yearOption,
                                    value === tipo.id && styles.yearOptionActive,
                                ]}
                                onPress={() => {
                                    onChange(tipo.id);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.yearOptionText,
                                        value === tipo.id && styles.yearOptionTextActive,
                                    ]}
                                >
                                    {tipo.descricao}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export default function CadastrarVaga() {
    const navigation = useNavigation<any>();
    const { usuario } = useUser();

    const [loading, setLoading] = useState(false);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [tiposVaga, setTiposVaga] = useState<TipoVaga[]>([]);

    const [formData, setFormData] = useState({
        descricao: "",
        exigencias: "",
        cargaHoraria: "",
        idTipoVaga: "",
    });

    // ── Carrega tipos de vaga do Firestore ────────────────────────────────────
    useEffect(() => {
        async function carregarTipos() {
            try {
                const snapshot = await getDocs(collection(db, "tipos_vaga"));
                const lista: TipoVaga[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    descricao: doc.data().nome ?? doc.id,
                }));
                setTiposVaga(lista);
            } catch (_) {
                Alert.alert("Erro", "Não foi possível carregar os tipos de vaga.");
            } finally {
                setLoadingTipos(false);
            }
        }

        carregarTipos();
    }, []);

    const handleInputChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const campoVazio = (value: string) => !value.trim();

    const validar = () => {
        if (campoVazio(formData.descricao)) {
            Alert.alert("Atenção", "Informe a descrição da vaga.");
            return false;
        }
        if (campoVazio(formData.exigencias)) {
            Alert.alert("Atenção", "Informe as exigências da vaga.");
            return false;
        }
        const ch = Number(formData.cargaHoraria);
        if (!formData.cargaHoraria || isNaN(ch) || ch <= 0) {
            Alert.alert("Atenção", "Informe uma carga horária válida.");
            return false;
        }
        if (!formData.idTipoVaga) {
            Alert.alert("Atenção", "Selecione o tipo de vaga.");
            return false;
        }
        return true;
    };

    const handleSalvar = async () => {
        if (!validar()) return;

        setLoading(true);
        try {
            const vaga = new Vaga({
                idEmpresa: usuario?.id ?? "",
                descricao: formData.descricao.trim(),
                exigencias: formData.exigencias.trim(),
                cargaHoraria: Number(formData.cargaHoraria),
                idTipoVaga: formData.idTipoVaga,
            });

            const docRef = await addDoc(collection(db, "vagas"), vaga.toFirestore());

            // Atualiza o id com o gerado pelo Firestore
            await updateDoc(doc(db, "vagas", docRef.id), { id: docRef.id });
            Alert.alert("Sucesso!", "Vaga cadastrada com sucesso.", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (_) {
            Alert.alert("Erro", "Não foi possível cadastrar a vaga. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

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
                    <View style={styles.card}>
                        <Text style={styles.title}>Cadastrar Vaga</Text>
                        <Text style={styles.subtitle}>
                            Preencha os dados da vaga de estágio
                        </Text>

                        {loadingTipos ? (
                            <ActivityIndicator
                                size="large"
                                color="#1e3a4f"
                                style={{ marginVertical: 32 }}
                            />
                        ) : (
                            <View style={styles.form}>

                                {/* Tipo de Vaga */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Tipo de Vaga</Text>
                                    <TipoVagaPicker
                                        value={formData.idTipoVaga}
                                        onChange={(v) => handleInputChange("idTipoVaga", v)}
                                        tipos={tiposVaga}
                                    />
                                </View>

                                {/* Carga Horária */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Carga Horária (horas/semana)</Text>
                                    <View style={styles.inputWrapper}>
                                        <Clock size={20} color="#9ca3af" />
                                        <TextInput
                                            placeholder="Ex: 20"
                                            value={formData.cargaHoraria}
                                            onChangeText={(v) =>
                                                handleInputChange("cargaHoraria", v.replace(/\D/g, ""))
                                            }
                                            style={styles.input}
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                {/* Descrição */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Descrição</Text>
                                    <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingVertical: 12 }]}>
                                        <AlignLeft size={20} color="#9ca3af" style={{ marginTop: 2 }} />
                                        <TextInput
                                            placeholder="Descreva as atividades e responsabilidades da vaga..."
                                            value={formData.descricao}
                                            onChangeText={(v) => handleInputChange("descricao", v)}
                                            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
                                            placeholderTextColor="#9ca3af"
                                            multiline
                                            numberOfLines={5}
                                        />
                                    </View>
                                </View>

                                {/* Exigências */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Exigências</Text>
                                    <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingVertical: 12 }]}>
                                        <CheckSquare size={20} color="#9ca3af" style={{ marginTop: 2 }} />
                                        <TextInput
                                            placeholder="Liste os requisitos necessários para a vaga..."
                                            value={formData.exigencias}
                                            onChangeText={(v) => handleInputChange("exigencias", v)}
                                            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
                                            placeholderTextColor="#9ca3af"
                                            multiline
                                            numberOfLines={5}
                                        />
                                    </View>
                                </View>

                                {/* Botão salvar */}
                                <TouchableOpacity
                                    style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                                    onPress={handleSalvar}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                            <FileText size={18} color="#fff" />
                                            <Text style={styles.buttonText}>Publicar Vaga</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}