import React, { useEffect } from 'react';
import { Layout, Typography } from 'antd';
import Footer from '../components/Footer';
import { usersStorage } from '../storage/usersStorage';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import firstPerson from '../assets/imagen1.png'
import secondPerson from '../assets/imagen2.png'
import thirdPerson from '../assets/imagen3.png'

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const users = usersStorage.getUsers()
    const adminData = {
      name: "ADMIN",
      email: "admin@mail.com",
      password: "pruebas123",
      isAdmin: true,
      isCustomer: false,
      isTeacher: false
    }
    if (users.lenght === 0) {
      usersStorage.saveUser(adminData)
    } else {
      const admin = users.find((user) => user.isAdmin)
      if (!admin) {
        usersStorage.saveUser(adminData)
      }
    }

  }, [])

  return (
    <Layout>
      <Header />
      <Layout.Content style={{ height: '100vh' }}>
        <section class="hero">
          <h2>Bienvenido al Sistema de Control y Seguimiento de Proyectos de Investigación</h2>
          <p>Gestiona y sigue tus proyectos de manera sencilla y eficiente</p>
          <a onClick={() => navigate("/login")} class="btn">Iniciar Sesión</a>
        </section>

        <section class="info">
          <div class="card">
            <h3>Fácil de Usar</h3>
            <p>Este sistema está diseñado para que puedas gestionar tus proyectos de investigación sin complicaciones.</p>
          </div>
          <div class="card">
            <h3>Monitorea tu Progreso</h3>
            <p>Mantente al tanto de los avances en tus proyectos y recibe retroalimentación oportuna.</p>
          </div>
          <div class="card">
            <h3>Colabora con tu Equipo</h3>
            <p>Comunícate fácilmente con los miembros de tu equipo y con los coordinadores de la universidad.</p>
          </div>
        </section>
      </Layout.Content>
    </Layout>
  );
};

export default HomePage;