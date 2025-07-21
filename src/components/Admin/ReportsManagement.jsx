import React, { useEffect, useState } from "react";
import { getSalesSummary, getTopProducts, getOrdersByStatus, getTopCustomers, getLowStockVariants } from "../../api/Reports";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import Swal from "sweetalert2";
import { FaFilePdf } from "react-icons/fa";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReportsManagement.css";

const COLORS = ['#E63946', '#FFA500', '#1890FF', '#FF8042', '#aa336a'];

const ReportsManagement = () => {
    const [salesSummary, setSalesSummary] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [filterType, setFilterType] = useState("custom");
    const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

    useEffect(() => {
        // Cambia las fechas según el tipo de filtro
        switch (filterType) {
            case "today":
                setStartDate(dayjs().format("YYYY-MM-DD"));
                setEndDate(dayjs().format("YYYY-MM-DD"));
                break;
            case "week":
                setStartDate(dayjs().startOf("week").format("YYYY-MM-DD"));
                setEndDate(dayjs().endOf("week").format("YYYY-MM-DD"));
                break;
            case "month":
                setStartDate(dayjs().startOf("month").format("YYYY-MM-DD"));
                setEndDate(dayjs().endOf("month").format("YYYY-MM-DD"));
                break;
            case "year":
                setStartDate(dayjs().startOf("year").format("YYYY-MM-DD"));
                setEndDate(dayjs().endOf("year").format("YYYY-MM-DD"));
                break;
            case "custom":
            default:
                // no cambia nada
                break;
        }
    }, [filterType]);

    const getDisplayedDateRange = () => {
        switch (filterType) {
            case "today":
                return `Hoy: ${dayjs(startDate).format("DD/MM/YYYY")}`;
            case "week":
                return `Semana actual: ${dayjs(startDate).format("DD/MM/YYYY")} al ${dayjs(endDate).format("DD/MM/YYYY")}`;
            case "month":
                return `Mes actual: ${dayjs(startDate).format("DD/MM/YYYY")} al ${dayjs(endDate).format("DD/MM/YYYY")}`;
            case "year":
                return `Año actual: ${dayjs(startDate).format("DD/MM/YYYY")} al ${dayjs(endDate).format("DD/MM/YYYY")}`;
            case "custom":
                return `Rango personalizado: ${dayjs(startDate).format("DD/MM/YYYY")} al ${dayjs(endDate).format("DD/MM/YYYY")}`;
            default:
                return "";
        }
    };


    useEffect(() => {
        async function fetchReports() {
            try {
                const [salesRes, topProdRes, ordersRes, topCustRes, lowStockRes] = await Promise.all([
                    getSalesSummary(startDate, endDate),
                    getTopProducts(startDate, endDate),
                    getOrdersByStatus(startDate, endDate),
                    getTopCustomers(startDate, endDate),
                    getLowStockVariants()
                ]);
                setSalesSummary(salesRes.data);
                setTopProducts(topProdRes.data);
                setOrdersByStatus(ordersRes.data);
                setTopCustomers(topCustRes.data);
                setLowStock(lowStockRes.data);
            } catch (error) {
                console.error("Error al cargar los reportes:", error);
                Swal.fire("Error", "No se pudieron cargar los reportes.", "error");
            }
        }

        fetchReports();
    }, [startDate, endDate]);

    console.log(topCustomers);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#fff",
                        color: "#333",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{label}</p>
                    <p style={{ margin: 0 }}>
                        {`${payload[0].name}: ${payload[0].value}`}
                    </p>
                </div>
            );
        }

        return null;
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de la Tienda", 14, 15);
        doc.setFontSize(11);
        doc.text(getDisplayedDateRange(), 14, 25);

        // Resumen de ventas
        if (salesSummary) {
            doc.setFontSize(14);
            doc.text("Resumen de Ventas", 14, 35);
            doc.setFontSize(11);
            doc.text(`Total de pedidos: ${salesSummary.total_orders}`, 14, 42);
            doc.text(`Total productos vendidos: ${salesSummary.total_products_sold}`, 14, 48);
            doc.text(`Total ingresos: $${salesSummary.total_income}`, 14, 54);
        }

        let finalY = 65;

        // Productos más vendidos
        if (topProducts.length > 0) {
            doc.setFontSize(14);
            doc.text("Productos más vendidos", 14, finalY);
            finalY += 6;

            autoTable(doc, {
                startY: finalY,
                head: [['Producto', 'Color', 'Talla', 'Cantidad']],
                body: topProducts.map(p => [
                    p.variant__product__name,
                    p.variant__color,
                    p.size__size,
                    p.total_sold
                ]),
                theme: 'striped',
                headStyles: { fillColor: [22, 160, 133] },
            });

            finalY = doc.lastAutoTable.finalY + 10;
        }

        // Clientes frecuentes
        if (topCustomers.length > 0) {
            doc.setFontSize(14);
            doc.text("Clientes Frecuentes", 14, finalY);
            finalY += 6;

            autoTable(doc, {
                startY: finalY,
                head: [['Cliente', 'Correo', 'Pedidos', 'Total gastado']],
                body: topCustomers.map(c => [
                    c.user__name,
                    c.user__email,
                    c.orders_count,
                    `$${c.total_spent}`
                ]),
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
            });

            finalY = doc.lastAutoTable.finalY + 10;
        }

        // Variantes con bajo stock
        if (lowStock.length > 0) {
            doc.setFontSize(14);
            doc.text("Productos con Bajo Stock", 14, finalY);
            finalY += 6;

            autoTable(doc, {
                startY: finalY,
                head: [['Producto', 'Color', 'Talla', 'Stock']],
                body: lowStock.map(i => [
                    i.product,
                    i.variant,
                    i.size,
                    i.stock
                ]),
                theme: 'striped',
                headStyles: { fillColor: [231, 76, 60] },
            });
        }

        doc.save(`reporte_${dayjs().format("YYYY-MM-DD")}.pdf`);
    };


    return (
        <div className="reports-container">
            <h1>Reportes de la tienda</h1>
                <button className="export-btn" onClick={exportToPDF}>
                    Exportar a PDF <FaFilePdf />
                </button>

            {/* Filtros */}
            <div className="date-filters">
                <label>
                    Tipo de filtro:&nbsp;
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="today">Hoy</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Este mes</option>
                        <option value="year">Este año</option>
                        <option value="custom">Rango personalizado</option>
                    </select>
                    <div className="date-summary">
                        <strong>Analizando:</strong> {getDisplayedDateRange()}
                    </div>
                </label>


                {filterType === "custom" && (
                    <>
                        <label>
                            Fecha inicio:
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </label>
                        <label>
                            Fecha fin:
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </label>
                    </>
                )}
            </div>

            {/* Resumen de ventas */}
            {salesSummary && (
                <div className="report-section">
                    <h2>Resumen de Ventas</h2>
                    <p>Total de pedidos: {salesSummary.total_orders}</p>
                    <p>Total de Productos vendidos: {salesSummary.total_products_sold}</p>
                    <p>Total de ingresos: ${salesSummary.total_income}</p>
                </div>
            )}

            {/* Productos más vendidos */}
            <div className="report-section">
                <h2>Productos más vendidos</h2>
                {topProducts.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Color</th>
                                    <th>Talla</th>
                                    <th>Cantidad vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map(product => (
                                    <tr key={product.product__id}>
                                        <td>{product.variant__product__name}</td>
                                        <td>{product.variant__color}</td>
                                        <td>{product.size__size}</td>
                                        <td>{product.total_sold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey={entry => `${entry.variant__product__name} (${entry.variant__color})`}
                                    interval={0}
                                    angle={0}
                                    textAnchor="middle"
                                />
                                <YAxis />
                                <Tooltip content={CustomTooltip} />
                                <Legend />
                                <Bar dataKey="total_sold" fill="#82ca9d" name="Cantidad Vendida" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                ) : (
                    <p>No hay productos vendidos.</p>
                )}
            </div>

            {/* Pedidos por estado */}
            <div className="report-section">
                <h2>Pedidos por Estado</h2>
                {ordersByStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ordersByStatus}
                                dataKey="total"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {ordersByStatus.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No hay datos.</p>
                )}
            </div>

            {/* Clientes frecuentes */}
            <div className="report-section">
                <h2>Clientes Frecuentes</h2>
                {topCustomers.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Correo</th>
                                    <th>Pedidos</th>
                                    <th>Total gastado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map(customer => (
                                    <tr key={customer.user__id}>
                                        <td>{customer.user__name}</td>
                                        <td>{customer.user__email}</td>
                                        <td>{customer.orders_count}</td>
                                        <td>${customer.total_spent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topCustomers}>
                                <XAxis dataKey="user__name" />
                                <YAxis />
                                <Tooltip content={CustomTooltip} />
                                <Bar dataKey="orders_count" fill="#8884d8" name="Ordenes pagadas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                ) : (
                    <p>No hay datos para mostrar.</p>
                )}
            </div>

            {/* Variantes con bajo stock */}
            <div className="report-section">
                <h2>Productos con Bajo Stock</h2>
                {lowStock.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Color</th>
                                <th>Talla</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product}</td>
                                    <td>{item.variant}</td>
                                    <td>{item.size}</td>
                                    <td>{item.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay variantes con bajo stock.</p>
                )}
            </div>
        </div>
    );
};

export default ReportsManagement;