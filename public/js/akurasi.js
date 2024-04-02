const tambahButton = document.getElementById("tambah-data");
const inputBulan = document.getElementById("bulan");
const inputPenjualan = document.getElementById("penjualan");

// cek session storage
if (typeof Storage !== "undefined") {
  console.log("Session storage tersedia.");
} else {
  swal.fire({
    title: "Error!",
    text: "Maaf, Browser ini tidak mendukung session storage.",
    icon: "error",
  });
}

// get data penjualan.json
const getPenjualanJSON = async () => {
  try {
    const response = await fetch("/data/penjualan.json");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error: ", error);
  }
};

// render data table penjualan
const renderDataTable = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const tablePenjualan = document.getElementById("table-penjualan");

  // cek data
  if (sessionData.length === 0) {
    tablePenjualan.innerHTML = `
      <tr>
        <td colspan="3">Data penjualan tidak tersedia.</td>
      </tr>
    `;
  } else {
    tablePenjualan.innerHTML = `
    <thead>
      <tr class="text-center">
        <th>No</th>
        <th>Bulan</th>
        <th>Penjualan</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      ${sessionData
        .map(
          (data) => `
        <tr>
          <td class="text-center">${data.id}</td>
          <td>${data.bulan}</td>
          <td class="text-center">${data.penjualan}</td>
          <td class="text-center">
            <button class="btn btn-warning" onclick="onEdit(${data.id})">Edit</button>
            <button class="btn btn-danger" onclick="onDelete(${data.id})">Hapus</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
  }
};

// add data penjualan
const addDataPenjualan = () => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const id = sessionData.length + 1;
  const bulan = inputBulan.value;
  const penjualan = inputPenjualan.value;

  const newData = {
    id,
    bulan,
    penjualan,
  };

  if (!bulan || !penjualan) {
    swal.fire({
      title: "Error!",
      text: "Silahkan isi data penjualan terlebih dahulu.",
      icon: "error",
    });

    return;
  }

  sessionData.push(newData);
  sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

  inputBulan.value = "";
  inputPenjualan.value = "";

  swal.fire({
    title: "Data berhasil ditambahkan!",
    text: "Data penjualan berhasil ditambahkan ke session storage.",
    icon: "success",
  });

  renderDataTable();
};

// edit data penjualan
const onEdit = (id) => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;
  const data = sessionData.find((data) => data.id === id);

  swal
    .fire({
      title: "Edit Data Penjualan",
      html: `
      <label for="modal-bulan" class="form-label">Bulan</label>
      <select name="bulan" id="modal-bulan" class="form-select">
            <option value="${data.bulan}" selected hidden>${data.bulan}</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
      <label for="penjualan" class="form-label">Penjualan</label>
      <input type="number" id="modal-penjualan" class="form-control" value="${data.penjualan}" required>
    `,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    })
    .then((result) => {
      if (result.isConfirmed) {
        const newData = {
          id,
          bulan: document.getElementById("modal-bulan").value,
          penjualan: document.getElementById("modal-penjualan").value,
        };

        const updatedData = sessionData.map((data) =>
          data.id === id ? newData : data
        );

        storedData.data = updatedData;
        sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

        swal.fire({
          title: "Data berhasil diubah!",
          text: "Data penjualan berhasil diubah di session storage.",
          icon: "success",
        });

        renderDataTable();
      }
    });
};

// delete data penjualan
const onDelete = (id) => {
  const storedData = JSON.parse(sessionStorage.getItem("dataPenjualan"));
  const sessionData = storedData.data;

  const newData = sessionData.filter((data) => data.id !== id);

  storedData.data = newData;

  sessionStorage.setItem("dataPenjualan", JSON.stringify(storedData));

  swal.fire({
    title: "Data berhasil dihapus!",
    text: "Data penjualan berhasil dihapus dari session storage.",
    icon: "success",
  });

  renderDataTable();
};

// event listener
tambahButton.addEventListener("click", addDataPenjualan);

document.addEventListener("DOMContentLoaded", async () => {
  // cek data penjualan di session storage
  const storedDataPenjualan = JSON.parse(
    sessionStorage.getItem("dataPenjualan")
  );

  if (!storedDataPenjualan) {
    // get file penjualan.json
    const data = await getPenjualanJSON();
    // simpan data ke session storage
    sessionStorage.setItem("dataPenjualan", JSON.stringify(data));
  }

  // render table penjualan
  renderDataTable();
});
