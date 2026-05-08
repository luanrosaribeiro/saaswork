import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Building2,
    Calendar,
    GraduationCap,
    LogOut,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, useNavigation } from "@react-navigation/native";
import styles, { colors } from "../assets/style/estilo";
import { useUser } from "../context/UserContext";
import { AuthService } from "../services/AuthService";
import { Empresa } from "../models/Empresa";
import { Estudante } from "../models/Estudante";

function InfoRow({
    label,
    value,
    Icon,
}: {
    label: string;
    value?: string;
    Icon: React.ComponentType<{ size: number; color: string }>;
}) {
    return (
        <View style={styles.candidaturaMetaRow}>
            <Icon size={16} color={colors.labelMuted} />
            <View style={{ flex: 1 }}>
                <Text style={[styles.candidaturaDate, { marginBottom: 2 }]}>{label}</Text>
                <Text style={styles.candidaturaMetaText}>{value || "Não informado"}</Text>
            </View>
        </View>
    );
}

export default function PerfilScreen() {
    const navigation = useNavigation<any>();
    const { usuario, setUsuario } = useUser();
    const [loadingLogout, setLoadingLogout] = useState(false);

    const endereco = usuario?.endereco;
    const enderecoCompleto = endereco
        ? [
            endereco.rua,
            endereco.numero,
            endereco.complemento,
            endereco.bairro,
            endereco.cidade,
            endereco.estado,
        ]
            .filter(Boolean)
            .join(", ")
        : "";

    const voltarParaLogin = () => {
        const resetAction = CommonActions.reset({ index: 0, routes: [{ name: "Login" }] });
        const parentNavigation = navigation.getParent?.();
        if (parentNavigation) {
            parentNavigation.dispatch(resetAction);
            return;
        }
        navigation.dispatch(resetAction);
    };

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await AuthService.logout();
            setUsuario(null);
            voltarParaLogin();
        } catch (error) {
            console.log("Erro ao fazer logout:", error);
            Alert.alert("Erro", "Não foi possível sair da conta.");
        } finally {
            setLoadingLogout(false);
        }
    };

    if (!usuario) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <View style={[styles.emptyCard, { margin: 16 }]}>
                    <Text style={styles.emptyTitle}>Perfil não encontrado</Text>
                    <Text style={styles.emptySubtitle}>Faça login novamente para ver seus dados.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isEstudante = usuario.tipo === "estudante";
    const estudante = isEstudante ? (usuario as Estudante) : null;
    const empresa = !isEstudante ? (usuario as Empresa) : null;
    const nomePrincipal = isEstudante ? usuario.nome : empresa?.nomeEmpresa;
    const subtitulo = isEstudante ? "Estudante" : "Empresa";

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.screenContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.screenHeaderTitle}>Perfil</Text>
                    <Text style={styles.screenHeaderSubtitle}>Dados da sua conta</Text>
                </View>

                {/* Card único com todos os dados */}
                <View style={[styles.candidaturaCard, { gap: 16, marginBottom: 12 }]}>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <View style={styles.userTypeIconWrapper}>
                            {isEstudante ? (
                                <GraduationCap size={28} color={colors.primary} />
                            ) : (
                                <Building2 size={28} color={colors.primary} />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.screenHeaderTitle}>{nomePrincipal}</Text>
                            <Text style={styles.screenHeaderSubtitle}>{subtitulo}</Text>
                        </View>
                    </View>

                    <View style={{ gap: 12 }}>
                        <InfoRow label="E-mail" value={usuario.email} Icon={Mail} />
                        <InfoRow label="Telefone" value={usuario.telefone} Icon={Phone} />
                        <InfoRow label="Endereço" value={enderecoCompleto} Icon={MapPin} />
                        <InfoRow label="CEP" value={endereco?.cep} Icon={MapPin} />
                    </View>

                    <View style={{ height: 1, backgroundColor: colors.border ?? "#e5e7eb" }} />

                    {isEstudante && estudante && (
                        <View style={{ gap: 12 }}>
                            <Text style={styles.candidaturaTitle}>Dados do estudante</Text>
                            <InfoRow label="CPF" value={estudante.cpf} Icon={User} />
                            <InfoRow label="Data de nascimento" value={estudante.dt_nascimento} Icon={Calendar} />

                            {estudante.escolaridades.length > 0 && (
                                <View style={{ gap: 8 }}>
                                    <Text style={styles.sectionLabel}>Escolaridades</Text>
                                    {estudante.escolaridades.map((escolaridade) => (
                                        <View key={escolaridade.id} style={styles.escolaridadeCard}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={[
                                                        styles.escolaridadeText,
                                                        { color: colors.primary, fontWeight: "600" },
                                                    ]}
                                                >
                                                    {escolaridade.curso || escolaridade.nivelEscolaridade}
                                                </Text>
                                                <Text style={styles.escolaridadeText}>
                                                    {escolaridade.instituicao || "Instituição não informada"}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.escolaridadeText,
                                                        { fontSize: 12, color: colors.labelMuted },
                                                    ]}
                                                >
                                                    {escolaridade.anoInicio || "Início não informado"} -{" "}
                                                    {escolaridade.anoConclusao || "Cursando"}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {!isEstudante && empresa && (
                        <View style={{ gap: 12 }}>
                            <Text style={styles.candidaturaTitle}>Dados da empresa</Text>
                            <InfoRow label="Nome da empresa" value={empresa.nomeEmpresa} Icon={Building2} />
                            <InfoRow label="CNPJ" value={empresa.cnpj} Icon={Building2} />
                            <InfoRow label="Responsável" value={empresa.responsavel || empresa.nome} Icon={User} />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.buttonPrimary, { flex: 0, marginTop: 8 }]}
                    onPress={() => navigation.navigate("EditarPerfil")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Editar perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.buttonPrimary,
                        { flex: 0, backgroundColor: "#dc2626", marginTop: 8 },
                        loadingLogout && styles.buttonDisabled,
                    ]}
                    onPress={handleLogout}
                    disabled={loadingLogout}
                    activeOpacity={0.8}
                >
                    {loadingLogout ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <LogOut size={18} color="#fff" />
                            <Text style={styles.buttonText}>Sair</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}