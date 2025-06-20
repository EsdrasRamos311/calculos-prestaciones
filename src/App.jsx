import React, { useState } from "react";

export default function App() {
  const [salarioMensual, setSalarioMensual] = useState("");
  const [bonificacion, setBonificacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [diasVacacionesPendientes, setDiasVacacionesPendientes] = useState("");
  const [resultado, setResultado] = useState(null);

  // Función para calcular días incluyendo el día final
  const calcularDiasIncluyendoFin = (inicio, fin) => {
    const diffMs = fin - inicio;
    return diffMs >= 0 ? Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1 : 0;
  };

  // Usamos esta función para calcular días totales trabajados (indemnización)
  const calcularDias = (inicio, fin) => {
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    return calcularDiasIncluyendoFin(inicioDate, finDate);
  };

  // Días para aguinaldo según fecha inicio y fin
  const calcularDiasAguinaldo = (fechaInicio, fechaFin) => {
    const fin = new Date(fechaFin);
    const ingreso = new Date(fechaInicio);
    const inicioPeriodo = new Date(fin.getFullYear() - 1, 11, 1); // 1 diciembre año anterior
    const desde = ingreso > inicioPeriodo ? ingreso : inicioPeriodo;
    return calcularDiasIncluyendoFin(desde, fin);
  };

  // Días para bono 14 según fecha inicio y fin
  const calcularDiasBono14 = (fechaInicio, fechaFin) => {
    const fin = new Date(fechaFin);
    const ingreso = new Date(fechaInicio);
    const inicioPeriodo = new Date(fin.getFullYear() - 1, 6, 1); // 1 julio año anterior
    const desde = ingreso > inicioPeriodo ? ingreso : inicioPeriodo;
    return calcularDiasIncluyendoFin(desde, fin);
  };

  const calcularPrestaciones = () => {
    const s = Number(salarioMensual);
    const b = Number(bonificacion) || 0; // Si está vacío, 0
    const diasVacPend = Number(diasVacacionesPendientes);

    if (!s || !fechaInicio || !fechaFin || diasVacPend < 0) {
      alert("Por favor, ingresa todos los datos correctamente.");
      return;
    }

    const salarioParaCalculo = s + b; // salario + bonificación para cálculo de prestaciones

    const diasTrabajados = calcularDias(fechaInicio, fechaFin);
    const salarioDiario = salarioParaCalculo / 30;

    const diasAguinaldo = calcularDiasAguinaldo(fechaInicio, fechaFin);
    const diasBono14 = calcularDiasBono14(fechaInicio, fechaFin);

    const aguinaldo = (salarioParaCalculo / 365) * diasAguinaldo;
    const bono14 = (salarioParaCalculo / 365) * diasBono14;
    const vacaciones = salarioDiario * diasVacPend;

    const baseIndemnizacion = salarioParaCalculo + salarioParaCalculo / 12 + salarioParaCalculo / 12;
    const indemnizacion = (baseIndemnizacion / 365) * diasTrabajados;

    setResultado({
      bono14,
      aguinaldo,
      vacaciones,
      indemnizacion,
      total: bono14 + aguinaldo + vacaciones + indemnizacion,
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Calculadora de Prestaciones</h1>

      <div>
        <label>Salario mensual (Q): </label>
        <input
          type="number"
          value={salarioMensual}
          onChange={(e) => setSalarioMensual(e.target.value)}
        />
      </div>

      <div>
        <label>Bonificación adicional para cálculo de prestaciones (Q): </label>
        <input
          type="number"
          value={bonificacion}
          onChange={(e) => setBonificacion(e.target.value)}
          placeholder="0 si no aplica"
        />
      </div>

      <div>
        <label>Fecha de inicio de labores: </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>

      <div>
        <label>Fecha final de labores: </label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>

      <div>
        <label>Días pendientes de vacaciones: </label>
        <input
          type="number"
          value={diasVacacionesPendientes}
          onChange={(e) => setDiasVacacionesPendientes(e.target.value)}
        />
      </div>

      <button onClick={calcularPrestaciones} style={{ marginTop: "10px" }}>
        Calcular
      </button>

      {resultado && (
        <div style={{ marginTop: "20px" }}>
          <h2>Resultado</h2>
          <p>
            <strong>Bono 14 proporcional:</strong> Q{resultado.bono14.toFixed(2)}
          </p>
          <p>
            <strong>Aguinaldo proporcional:</strong> Q{resultado.aguinaldo.toFixed(2)}
          </p>
          <p>
            <strong>Vacaciones:</strong> Q{resultado.vacaciones.toFixed(2)}
          </p>
          <p>
            <strong>Indemnización:</strong> Q{resultado.indemnizacion.toFixed(2)}
          </p>
          <hr />
          <p>
            <strong>Total a pagar:</strong> <strong>Q{resultado.total.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
