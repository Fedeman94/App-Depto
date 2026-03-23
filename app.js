const SUPA_URL = 'https://cileqfmwbiantewungvd.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbGVxZm13YmlhbnRld3VuZ3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDU1OTgsImV4cCI6MjA4OTY4MTU5OH0.YpDL2MAzNkkcDYwWPnX_Cwj4k3Fmarw26Xx1wxbvey0';

async function supaFetch(method, path, body) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(err);
    throw new Error(err);
  }

  return await res.json();
}

async function cargarGastos() {
  try {
    const data = await supaFetch('GET', 'gastos?select=*&order=id.asc');

    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    data.forEach(g => {
      const li = document.createElement('li');
      li.textContent = `${g.descripcion} - $${g.monto} (${g.tipo})`;
      lista.appendChild(li);
    });

  } catch (e) {
    alert('Error cargando datos');
  }
}

async function agregarGasto() {
  const desc = document.getElementById('desc').value;
  const monto = parseFloat(document.getElementById('monto').value);
  const tipo = document.getElementById('tipo').value;

  let fede = 0;
  let mica = 0;
  let saldo = 0;

  if (tipo === '50/50') {
    fede = monto / 2;
    mica = monto / 2;
    saldo = fede;
  } else if (tipo === 'P1') {
    fede = monto;
  } else {
    mica = monto;
  }

  try {
    await supaFetch('POST', 'gastos', {
      mes: 'Marzo',
      anio: 2026,
      categoria: 'Otros',
      descripcion: desc,
      quien_pago: 'Fede',
      monto: monto,
      tipo: tipo,
      fede: fede,
      mica: mica,
      saldo: saldo,
      pagado: 'No',
      notas: ''
    });

    alert('Guardado!');
    cargarGastos();

  } catch (e) {
    alert('Error guardando');
  }
}
