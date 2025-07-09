import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/Orders";
import {
    FaLock,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBox,
    FaMoneyBillWave,
    FaChevronDown,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaFilePdf,
    FaFileExcel
} from "react-icons/fa";
import { Select, Table, Tag, Space, Card, Statistic, DatePicker, Badge } from "antd";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./OrdersManagement.css";
import * as XLSX from 'xlsx';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColors = {
    PENDING: '#FFA500',
    PAID: '#1890FF',
    SHIPPED: '#52C41A',
    CANCELLED: '#E63946'
};

const GestiónPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');
    const [rangoFechas, setRangoFechas] = useState([]);
    const [rangoFechasExcel, setRangoFechasExcel] = useState([]);

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const res = await getOrders();
                setPedidos(res.data);
                setPedidosFiltrados(res.data);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
                mostrarError("No se pudieron cargar los pedidos");
            } finally {
                setCargando(false);
            }
        };
        cargarPedidos();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [terminoBusqueda, filtroEstado, rangoFechas, pedidos]);

    const aplicarFiltros = () => {
        let resultado = [...pedidos];

        // Filtro de búsqueda
        if (terminoBusqueda) {
            const term = terminoBusqueda.toLowerCase();
            resultado = resultado.filter(pedido =>
                pedido.id.toString().includes(terminoBusqueda) ||
                pedido.customer_email.toLowerCase().includes(term) ||
                (pedido.customer_phone && pedido.customer_phone.includes(terminoBusqueda))
            );
        }

        // Filtro por estado
        if (filtroEstado !== 'TODOS') {
            resultado = resultado.filter(pedido => pedido.status === filtroEstado);
        }

        // Filtro por fecha
        if (rangoFechas && rangoFechas.length === 2) {
            const fechaInicio = new Date(rangoFechas[0]);
            const fechaFin = new Date(rangoFechas[1]);
            fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día final

            resultado = resultado.filter(pedido => {
                const fechaPedido = new Date(pedido.created_at);
                return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
            });
        }

        setPedidosFiltrados(resultado);
    };

    const generarPDF = (pedido) => {
        try {
            const doc = new jsPDF();

            // Configuración del documento
            doc.setProperties({
                title: `Pedido_${pedido.id}`,
                subject: 'Detalles del pedido',
                author: 'Administrador'
            });

            // Logo y encabezado
            doc.setFontSize(18);
            doc.setTextColor(230, 57, 70);
            doc.text(`Pedido #${pedido.id}`, 105, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Fecha: ${new Date(pedido.created_at).toLocaleDateString('es-ES')}`, 14, 35);

            // Información del cliente
            doc.setFontSize(14);
            doc.setTextColor(230, 57, 70);
            doc.text('Información del Cliente', 14, 50);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Correo: ${pedido.customer_email}`, 14, 60);
            if (pedido.customer_phone) {
                doc.text(`Teléfono: ${pedido.customer_phone}`, 14, 70);
            }

            // Dirección de envío
            doc.setFontSize(14);
            doc.setTextColor(230, 57, 70);
            doc.text('Dirección de Envío', 14, 85);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`${pedido.address}`, 14, 95);
            doc.text(`${pedido.city}, ${pedido.department}`, 14, 105);

            // Tabla de productos
            const productosData = pedido.items.map(item => [
                item.variant_name,
                item.size,
                item.quantity,
                `$${item.price.toLocaleString('es-ES')}`,
                `$${(item.price * item.quantity).toLocaleString('es-ES')}`
            ]);

            autoTable(doc, {
                startY: 125,
                head: [['Producto', 'Talla', 'Cantidad', 'Precio Unitario', 'Subtotal']],
                body: productosData,
                headStyles: {
                    fillColor: [230, 57, 70],
                    textColor: 255,
                    fontSize: 10
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 9
                },
                margin: { left: 14 },
                styles: {
                    cellPadding: 3,
                    overflow: 'linebreak',
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto' },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 'auto' }
                }
            });

            // Total del pedido
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.setTextColor(230, 57, 70);
            doc.text('Total del Pedido:', 14, finalY);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`$${pedido.total_price.toLocaleString('es-ES')}`, 60, finalY);

            // Estado del pedido
            doc.setFontSize(12);
            doc.text(`Estado: ${obtenerTextoEstado(pedido.status)}`, 14, finalY + 10);

            // Guardar el PDF
            doc.save(`Pedido_${pedido.id}.pdf`);

            mostrarExito(`PDF del pedido #${pedido.id} generado correctamente`);
        } catch (error) {
            console.error("Error generando PDF:", error);
            mostrarError("Error al generar el PDF. Por favor intente nuevamente.");
        }
    };

    const exportarAExcel = () => {
        if (!rangoFechasExcel || rangoFechasExcel.length !== 2) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor seleccione un rango de fechas válido",
                confirmButtonColor: "#E63946",
                background: "#1F1F1F",
                color: "#F1F1F1"
            });
            return;
        }

        try {
            // Filtrar pedidos por el rango de fechas seleccionado
            const fechaInicio = new Date(rangoFechasExcel[0]);
            const fechaFin = new Date(rangoFechasExcel[1]);
            fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día final

            const pedidosFiltrados = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.created_at);
                return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
            });

            if (pedidosFiltrados.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Sin datos",
                    text: "No hay pedidos en el rango de fechas seleccionado",
                    confirmButtonColor: "#E63946",
                    background: "#1F1F1F",
                    color: "#F1F1F1"
                });
                return;
            }

            // Preparar los datos para Excel
            const datosExcel = pedidosFiltrados.map(pedido => ({
                'ID Pedido': pedido.id,
                'Fecha': new Date(pedido.created_at).toLocaleDateString('es-ES'),
                'Cliente': pedido.customer_email,
                'Teléfono': pedido.customer_phone || 'N/A',
                'Dirección': `${pedido.address}, ${pedido.city}`,
                'Estado': obtenerTextoEstado(pedido.status),
                'Total': `$${pedido.total_price.toLocaleString('es-ES')}`,
                'Productos': pedido.items.map(item =>
                    `${item.variant_name} (Talla: ${item.size}, Cantidad: ${item.quantity})`
                ).join('; ')
            }));

            // Crear libro de Excel
            const libro = XLSX.utils.book_new();
            const hoja = XLSX.utils.json_to_sheet(datosExcel);

            // Añadir hoja al libro
            XLSX.utils.book_append_sheet(libro, hoja, "Pedidos");

            // Generar nombre de archivo con las fechas
            const formatoFecha = (fecha) => fecha.toISOString().split('T')[0];
            const nombreArchivo = `Pedidos_${formatoFecha(fechaInicio)}_a_${formatoFecha(fechaFin)}.xlsx`;

            // Descargar el archivo
            XLSX.writeFile(libro, nombreArchivo);

            mostrarExito(`Archivo Excel generado: ${nombreArchivo}`);
        } catch (error) {
            console.error("Error generando Excel:", error);
            mostrarError("Error al generar el archivo Excel");
        }
    };

    const cambiarEstadoPedido = async (pedido, nuevoEstado) => {
        if (nuevoEstado === "CANCELLED") {
            const resultado = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas cancelar el pedido #${pedido.id}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No",
                confirmButtonColor: "#E63946",
                background: "#1F1F1F",
                color: "#F1F1F1"
            });
            if (!resultado.isConfirmed) return;
        }

        try {
            await updateOrderStatus(pedido.id, nuevoEstado);
            setPedidos(prev => prev.map(p => p.id === pedido.id ? { ...p, status: nuevoEstado } : p));
            mostrarExito(`Estado del pedido #${pedido.id} actualizado a "${obtenerTextoEstado(nuevoEstado)}"`);
        } catch {
            mostrarError("No se pudo actualizar el estado");
        }
    };

    const obtenerTextoEstado = (estado) => {
        const mapa = {
            PENDING: "Pendiente",
            PAID: "Pagado",
            SHIPPED: "Enviado",
            CANCELLED: "Cancelado",
        };
        return mapa[estado] || estado;
    };

    const mostrarExito = (mensaje) => {
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: mensaje,
            confirmButtonColor: "#E63946",
            background: "#1F1F1F",
            color: "#F1F1F1"
        });
    };

    const mostrarError = (mensaje) => {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: mensaje,
            confirmButtonColor: "#E63946",
            background: "#1F1F1F",
            color: "#F1F1F1"
        });
    };

    const columnas = [
        {
            title: 'ID Pedido',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span className="texto-tabla">#{id}</span>,
            sorter: (a, b) => a.id - b.id,
            width: 100
        },
        {
            title: 'Fecha',
            dataIndex: 'created_at',
            key: 'fecha',
            render: (fecha) => <span className="texto-tabla">{new Date(fecha).toLocaleDateString('es-ES')}</span>,
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            width: 120
        },
        {
            title: 'Cliente',
            key: 'cliente',
            render: (registro) => (
                <div className="celda-cliente">
                    <div className="correo-cliente">
                        <FaEnvelope className="icono" /> <span className="texto-tabla">{registro.customer_email}</span>
                    </div>
                    {registro.customer_phone && (
                        <div className="telefono-cliente">
                            <FaPhone className="icono" /> <span className="texto-tabla">{registro.customer_phone}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Artículos',
            key: 'articulos',
            render: (registro) => (
                <div className="celda-articulos">
                    {registro.items.map((item, index) => (
                        <div key={index} className="fila-articulo">
                            <span className="texto-tabla">
                                {item.variant_name} (Talla: <Badge count={item.size} style={{ backgroundColor: '#5C2E36' }} />) × {item.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Total',
            dataIndex: 'total_price',
            key: 'total',
            render: (total) => <span className="texto-tabla">${total.toLocaleString('es-ES')}</span>,
            sorter: (a, b) => a.total_price - b.total_price,
            width: 120
        },
        {
            title: 'Estado',
            key: 'estado',
            render: (registro) => (
                registro.status === "CANCELLED" ? (
                    <Tag
                        icon={<FaLock />}
                        color="#E63946"
                        className="tag-estado"
                    >
                        {obtenerTextoEstado(registro.status)}
                    </Tag>
                ) : (
                    <Select
                        value={registro.status}
                        onChange={(value) => cambiarEstadoPedido(registro, value)}
                        suffixIcon={<FaChevronDown className="icono-select" />}
                        className="selector-estado"
                        dropdownClassName="dropdown-estado"
                    >
                        <Option value="PENDING">
                            <Tag color="#FFA500">Pendiente</Tag>
                        </Option>
                        <Option value="PAID">
                            <Tag color="#1890FF">Pagado</Tag>
                        </Option>
                        <Option value="SHIPPED">
                            <Tag color="#52C41A">Enviado</Tag>
                        </Option>
                        <Option value="CANCELLED">
                            <Tag color="#E63946">Cancelar</Tag>
                        </Option>
                    </Select>
                )
            ),
            filters: [
                { text: 'Pendiente', value: 'PENDING' },
                { text: 'Pagado', value: 'PAID' },
                { text: 'Enviado', value: 'SHIPPED' },
                { text: 'Cancelado', value: 'CANCELLED' },
            ],
            onFilter: (value, record) => record.status === value,
            width: 150
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (registro) => (
                <Space size="middle">
                    <button
                        className="boton-accion boton-pdf"
                        onClick={() => generarPDF(registro)}
                        title="Guardar como PDF"
                    >
                        <FaFilePdf />
                    </button>
                </Space>
            ),
            width: 50
        },
    ];

    const estadisticas = [
        { title: 'Total Pedidos', value: pedidos.length, icon: <FaBox />, color: '#F1F1F1' },
        { title: 'Pendientes', value: pedidos.filter(p => p.status === 'PENDING').length, icon: <FaBox />, color: statusColors.PENDING },
        { title: 'Pagados', value: pedidos.filter(p => p.status === 'PAID').length, icon: <FaMoneyBillWave />, color: statusColors.PAID },
        { title: 'Enviados', value: pedidos.filter(p => p.status === 'SHIPPED').length, icon: <FaMapMarkerAlt />, color: statusColors.SHIPPED },
        { title: 'Cancelados', value: pedidos.filter(p => p.status === 'CANCELLED').length, icon: <FaLock />, color: statusColors.CANCELLED },
    ];

    return (
        <div className="contenedor-gestion-pedidos">
            <h1 className="titulo-pagina">Gestión de Pedidos</h1>

            <div className="filtros-superiores">
                <div className="contenedor-buscador">
                    <div className="buscador">
                        <FaSearch className="icono-busqueda" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, email o teléfono..."
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>
                </div>

                <div className="contenedor-filtros">
                    <div className="filtro-estado">
                        <FaFilter className="icono-filtro" />
                        <Select
                            value={filtroEstado}
                            onChange={setFiltroEstado}
                            suffixIcon={<FaChevronDown className="icono-select" />}
                            className="selector-filtro"
                            dropdownClassName="dropdown-filtro"
                        >
                            <Option value="TODOS">Todos los estados</Option>
                            <Option value="PENDING">Pendientes</Option>
                            <Option value="PAID">Pagados</Option>
                            <Option value="SHIPPED">Enviados</Option>
                            <Option value="CANCELLED">Cancelados</Option>
                        </Select>
                    </div>

                    <div className="filtro-fechas">
                        <FaCalendarAlt className="icono-calendario" />
                        <RangePicker
                            onChange={setRangoFechas}
                            className="range-picker-responsive"
                            placeholder={['Fecha inicio', 'Fecha fin']}
                        />
                    </div>
                </div>
            </div>

            <div className="tarjetas-estadisticas">
                {estadisticas.map((estadistica, index) => (
                    <Card key={index} className="tarjeta-estadistica" style={{ background: '#2A2A2A', borderColor: '#444' }}>
                        <Statistic
                            title={<span className="titulo-estadistica">{estadistica.title}</span>}
                            value={estadistica.value}
                            valueStyle={{ color: estadistica.color }}
                            prefix={<span style={{ color: estadistica.color }}>{estadistica.icon}</span>}
                        />
                    </Card>
                ))}
            </div>

            <div className="contenedor-tabla">
                <Table
                    columns={columnas}
                    dataSource={pedidosFiltrados}
                    rowKey="id"
                    loading={cargando}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => <span className="texto-tabla">{`Total: ${total} pedidos`}</span>,
                    }}
                    locale={{
                        emptyText: <span className="texto-tabla">No se encontraron pedidos</span>
                    }}
                    className="tabla-pedidos"
                    scroll={{ x: true }}
                />
            </div>

            <div className="contenedor-exportar-excel">
                <div className="selector-fechas-excel">
                    <FaCalendarAlt className="icono-calendario" />
                    <RangePicker
                        onChange={setRangoFechasExcel}
                        placeholder={['Fecha inicio', 'Fecha fin']}
                    />
                </div>

                <button
                    className={`boton-excel ${cargando ? 'cargando' : ''}`}
                    onClick={exportarAExcel}
                    disabled={!rangoFechasExcel || rangoFechasExcel.length !== 2 || cargando}
                    aria-label="Exportar a Excel"
                >
                    {!cargando && <FaFileExcel />}
                    {!cargando && 'Exportar a Excel'}
                </button>
            </div>
        </div>
    );
};

export default GestiónPedidos;