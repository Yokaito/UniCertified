module.exports = (data) => {
  let dia;
  let diaF;
  let mes;
  let mesF;
  let anoF;
  let hora = data.getHours() + 1;
  let minutos;
  let segundos;

  (dia = data.getDate().toString()),
    (diaF = dia.length == 1 ? "0" + dia : dia),
    (mes = (data.getMonth() + 1).toString()), //+1 pois no getMonth Janeiro começa com zero.
    (mesF = mes.length == 1 ? "0" + mes : mes),
    (anoF = data.getFullYear());
  hora = (hora < 10 ? "0" : "") + hora;
  minutos = (data.getMinutes() < 10 ? "0" : "") + data.getMinutes();
  segundos = (data.getSeconds() < 10 ? "0" : "") + data.getSeconds();

  return `${diaF}/${mesF}/${anoF} as ${hora}:${minutos}:${segundos}`;
};
