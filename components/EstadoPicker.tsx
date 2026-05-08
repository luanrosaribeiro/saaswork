import { ChevronDown, MapPin } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, } from "react-native";
import styles from "../assets/style/estilo";

const ESTADOS_BR = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO",
    "MA","MT","MS","MG","PA","PB","PR","PE","PI",
    "RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

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

export default EstadoPicker;