/// --- GET DATA
function getDatas() {
  const url = "https://learnbackend-production-3f70.up.railway.app/siswa";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const item = data.payload;
      for (let index = 0; index < item.length; index++) {
        let listDatas = document.getElementById("listDatas");
        let row = document.createElement("tr");
        let idSiswa = document.createElement("th");
        let namaSiswa = document.createElement("td");
        let statusSiswa = document.createElement("td");
        let nikSiswa = document.createElement("td");
        if (!listDatas) {
          return;
        }
        row.classList = "datasList";
        idSiswa.scope = "row";

        idSiswa.textContent = index + 1;
        namaSiswa.textContent = item[index].nama_siswa;
        statusSiswa.textContent = item[index].status_siswa;
        nikSiswa.textContent = item[index].nik_sekolah;

        row.appendChild(idSiswa);
        row.appendChild(namaSiswa);
        row.appendChild(statusSiswa);
        row.appendChild(nikSiswa);
        listDatas.appendChild(row);

        // const rows = row;
        const id = item[index].id;
        const nama = item[index].nama_siswa;
        const nik = item[index].nik_sekolah;
        const status = item[index].status_siswa;
        clickDatas(row, id, nama, nik, status);
      }
    });
}

getDatas();

function goToForm() {
  window.location.href = `form.html`;
}

function goToIndex() {
  window.location.href = "index.html";
}

function goToEdit(id) {
  window.location.href = `editForm.html?id=${id}`;
}

// SEARCH DATA

const searchDatasBtn = document.getElementById("searchDatasbtn");
const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = document.getElementById("searchInput").value.trim();
    if (!value) {
      showToast("Search fields cannot empty", "#3b82f6", 1500);
      return;
    } else {
      window.location.href = `search.html?q=${encodeURIComponent(value)}`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const listDatasSearch = document.getElementById("listDatasSearch");
  if (!listDatasSearch) return;
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("q");
  if (keyword) {
    searchDatas(keyword);
  }
});

function searchDatas(keyword) {
  const url = `https://learnbackend-production-3f70.up.railway.app/siswa/search?q=${encodeURIComponent(keyword)}`;
  fetch(url).then((response) => {
    response.json().then((data) => {
      const item = data.payload;
      const listDatasSearch = document.getElementById("listDatasSearch");

      if (!listDatasSearch) return;
      listDatasSearch.innerHTML = "";
      for (let index = 0; index < item.length; index++) {
        // console.log(listDatasSearch);
        const row = document.createElement("tr");
        const idSiswa = document.createElement("th");
        const namaSiswa = document.createElement("td");
        const statusSiswa = document.createElement("td");
        const nikSiswa = document.createElement("td");

        idSiswa.scope = "row";

        idSiswa.textContent = index + 1;
        namaSiswa.textContent = item[index].nama_siswa;
        statusSiswa.textContent = item[index].status_siswa;
        nikSiswa.textContent = item[index].nik_sekolah;

        row.appendChild(idSiswa);
        row.appendChild(namaSiswa);
        row.appendChild(statusSiswa);
        row.appendChild(nikSiswa);

        listDatasSearch.appendChild(row);
        const rows = row;
        const id = item[index].id;
        const nama = item[index].nama_siswa;
        const nik = item[index].nik_sekolah;
        const status = item[index].status_siswa;
        clickDatas(row, rows, id, nama, nik, status);
      }
    });
  });
}

/// --- ADD DATA
const btnInputForm = document.getElementById("btnInputForm");
if (btnInputForm) {
  btnInputForm.addEventListener("click", () => {
    goToForm();
  });
}
const formSiswa = document.getElementById("formSiswa");
if (formSiswa) {
  formSiswa.addEventListener("submit", (e) => {
    e.preventDefault();
    const namaSiswa = document.getElementById("namaSiswa");
    const statusSekolah = document.getElementById("status_sekolah");
    const nikSekolah = document.getElementById("nik_sekolah");
    if (namaSiswa && statusSekolah && nikSekolah) {
      const newNamaSiswa = namaSiswa.value;
      const newStatusSiswa = statusSekolah.value;
      const newNikSekolah = nikSekolah.value;
      if (newNamaSiswa && newStatusSiswa && newNikSekolah) {
        addData(newNamaSiswa, newStatusSiswa, newNikSekolah);
      }
    }
    formSiswa.reset();
  });
}

function addData(nama, status, nik) {
  //   console.log(nik);
  const url = "https://learnbackend-production-3f70.up.railway.app/siswa";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama_siswa: nama,
      status_siswa: status,
      nik_sekolah: nik,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal menambahkan data: " + response.status);
      }
      return response.json();
    })
    .then(() => {
      showToast("Data Added!", "#14b8a6", 1900).then(() => {
        goToIndex();
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// DELETE DATA
let currentDatas = {
  id: null,
  nik: null,
  nama: null,
  status: null,
};
function clickDatas(data, id, nama, nik, status) {
  data.addEventListener("click", () => {
    // rows.classList = "bg-info";
    if (id) {
      currentDatas.id = id;
      currentDatas.nama = nama;
      currentDatas.nik = nik;
      currentDatas.status = status;
      showToast("Data selected!!", "22c55e", 1500);
      // console.log(rows);
    }
  });
}
const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    if (!currentDatas.id) {
      showToast("Data is not selected!!", "#ef4444", 1500);
    } else {
      const url = "https://learnbackend-production-3f70.up.railway.app/siswa";
      fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentDatas.id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal menghapus data: " + response.status);
          }
          return response.json();
        })
        .then(() => {
          showToast("Data is Deleted", "#14b8a6", 1500).then(() => {
            goToIndex();
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  });
}

// UPDATE DATA
let namaEdit = document.getElementById("namaSiswaEdit");
let statusSekolahEdit = document.getElementById("status_sekolahEdit");
let nikSekolahEdit = document.getElementById("nik_sekolahEdit");
const editBtn = document.getElementById("editBtn");
if (editBtn) {
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentDatas.id) {
      showToast("Datas is not selected!!", "#ef4444", 1500);
    } else {
      goToEdit(currentDatas.id);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    editShow(id);
  }
});

function editShow(id) {
  const url = `https://learnbackend-production-3f70.up.railway.app/siswa/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.payload.length > 0) {
        const siswa = data.payload[0];
        const namaEdit = document.getElementById("namaSiswaEdit");
        const statusSekolahEdit = document.getElementById("status_sekolahEdit");
        const nikSekolahEdit = document.getElementById("nik_sekolahEdit");
        // console.log(document.getElementById("namaSiswaEdit"));
        if (namaEdit && statusSekolahEdit && nikSekolahEdit) {
          namaEdit.value = siswa.nama_siswa;
          statusSekolahEdit.value = siswa.status_siswa;
          nikSekolahEdit.value = siswa.nik_sekolah;
        }
      }
    });
}

const addBtnEdit = document.getElementById("addBtnEdit");
const btnClear = document.getElementById("btnClear");

if (btnClear) {
  btnClear.addEventListener("click", () => {
    formSiswa.reset();
  });
}
if (addBtnEdit) {
  addBtnEdit.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("halo");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const namaEdit = document.getElementById("namaSiswaEdit");
    const statusSekolahEdit = document.getElementById("status_sekolahEdit");
    const nikSekolahEdit = document.getElementById("nik_sekolahEdit");

    if (!id || !namaEdit || !statusSekolahEdit || !nikSekolahEdit) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Data tidak lengkap!",
        showConfirmButton: true,
      });
      return;
    }

    const url = "https://learnbackend-production-3f70.up.railway.app/siswa/update";
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        nama_siswa: namaEdit.value,
        status_siswa: statusSekolahEdit.value,
        nik_sekolah: nikSekolahEdit.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengedit data: " + response.status);
        }
        return response.text().then((text) => {
          console.log("Raw response:", text);
          return JSON.parse(text);
        });
      })
      .then((data) => {
        console.log("Response dari backend:", data);
        showToast("Data Updated", "#14b8a6", 1500).then(() => {
          goToIndex();
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal update data!",
          showConfirmButton: true,
        });
      });
  });
}
function showToast(message, color, duration) {
  return new Promise((resolve) => {
    Toastify({
      text: message,
      duration: duration,
      gravity: "top",
      position: "right",
      style: {
        background: color,
        borderRadius: "8px",
      },
    }).showToast();

    setTimeout(() => {
      resolve();
    }, duration);
  });
}
