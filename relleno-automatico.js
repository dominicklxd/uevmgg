// Ejecuta este código en la consola del navegador en la página del formulario

const datos = [
  { apellidos: "PABON TAPIA", nombres: "KENETH JAIR", cedula: "1050049517", correo: "patakeja10920957@estudiantes.edu.ec" },
  { apellidos: "PALMA GUAMAN", nombres: "MARIA JULIA", cedula: "105181357", correo: "pagumaju8306671@estudiantes.edu.ec" },
  { apellidos: "PRADO GUZMAN", nombres: "YULIAN NICOLAS", cedula: "1050033883", correo: "prguyuni5731405@estudiantes.edu.ec" },
  { apellidos: "RAMIREZ CARRANCO", nombres: "MATIAS ALEXANDER", cedula: "1050565132", correo: "racamaal10781586@estudiantes.edu.ec" },
  { apellidos: "REYES TIPANTUÑA", nombres: "ARGENIS ZAURI", cedula: "1050077120", correo: "retiarza7691255@estudiantes.edu.ec" },
  { apellidos: "RUANO PONCE", nombres: "ALISSON PRISCILA", cedula: "0402141923", correo: "rupoalpr7692397@estudiantes.edu.ec" },
  { apellidos: "RUIZ SUAREZ", nombres: "LUCIANA VALENTINA", cedula: "105058823", correo: "rusuluva10380528@estudiantes.edu.ec" },
  { apellidos: "TABANGO CACHIPUENDO", nombres: "ERICK GERARD", cedula: "1050073095", correo: "tacagerge7691086@estudiantes.edu.ec" },
  { apellidos: "TAMBA AGUILAR", nombres: "KEVIN CARLOS", cedula: "1050025004", correo: "taagkeca9580917@estudiantes.edu.ec" },
  { apellidos: "URCUANGO NUÑEZ", nombres: "DENIS MATEO", cedula: "1050053337", correo: "urnudema7730878@estudiantes.edu.ec" }
];

// Rellena los campos por id, no por placeholder
for (let i = 0; i < datos.length; i++) {
  document.getElementById(`apellidos${i+1}`).value = datos[i].apellidos;
  document.getElementById(`nombres${i+1}`).value = datos[i].nombres;
  document.getElementById(`cedula${i+1}`).value = datos[i].cedula;
  document.getElementById(`correo${i+1}`).value = datos[i].correo;
}
