import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#E4E4E4',
        paddingTop: '30%'
    },
    section: {
        margin: 10,
        padding: 10,
        textAlign: "center"
    },
    logoTitle: {
        fontWeight: 'bold',
        color: '#007bff'
    }
});

const Cerificate = ({ user, course }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.logoTitle}>CAPACITA T!</Text>
            </View>

            <View style={styles.section}>
                <Text>CERTIFICADO DE TERMINACIÓN DE CURSO</Text>
            </View>
            <View style={styles.section}>
                <Text>Certificamos que {user.name}, ha completado exitosamente el curso: {course.title} y ha adquirido los conocimientos esperados de manera satisfactoria</Text>
            </View>

        </Page>
    </Document>
);

export default Cerificate