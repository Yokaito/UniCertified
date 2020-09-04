$(document).ready(() => {
  $(".ui.dropdown").dropdown();
  $(".sidebar-menu-toggler").on("click", function () {
    var target = $(this).data("target");
    $(target)
      .sidebar({
        dimPage: true,
        transition: "overlay",
        mobileTransition: "overlay",
      })
      .sidebar("toggle");
  });
  $(".comentario").popup({
    inline: true,
  });

  chartAlunos();
  chartCertificados();

  async function chartCertificados() {
    let data = await getDataCertificados();
    let ctx = document.getElementById("myChart").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Maio",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        datasets: [
          {
            label: "Certificados Cadastrados por Mes",
            data: data.yValue,
            backgroundColor: "transparent",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  async function chartAlunos() {
    let data = await getDataAlunos();
    let ctx = document.getElementById("myChart2").getContext("2d");
    let myChart2 = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Maio",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        datasets: [
          {
            label: "Alunos Cadastrados por Mes",
            data: data.yValue,
            backgroundColor: "transparent",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  async function getDataCertificados() {
    let yValue = [];
    await $.post("/admin/estatisticas/datac", {}, (r) => {
      if (r) {
        r.data.forEach((e) => {
          yValue.push(e);
        });
      }
    });
    console.log(yValue);
    return { yValue };
  }

  async function getDataAlunos() {
    let yValue = [];
    await $.post("/admin/estatisticas/datau", {}, (r) => {
      if (r) {
        r.data.forEach((e) => {
          yValue.push(e);
        });
      }
    });
    console.log(yValue);
    return { yValue };
  }
});
