document.addEventListener('DOMContentLoaded', () => {
  const locationButton = document.getElementById('locationButton');
  const locationHeader = document.getElementById('locationHeader');
  const locationText = document.getElementById('locationText');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const initialView = document.getElementById('initialView');
  const hospitalList = document.getElementById('hospitalList');
  const hospitalDetails = document.getElementById('hospitalDetails');
  const detailsContent = document.getElementById('detailsContent');
  const backButton = document.getElementById('backButton');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const scheduleButton = document.getElementById('scheduleButton');
  const appointmentDate = document.getElementById('appointmentDate');

  let userLocation = null;
  let hospitals = [];

  locationButton.addEventListener('click', getUserLocation);
  backButton.addEventListener('click', showHospitalList);
  searchButton.addEventListener('click', searchHospitals);

  scheduleButton.addEventListener('click', function() {
    appointmentDate.style.display = 'block';
    appointmentDate.focus();
  });

  appointmentDate.addEventListener('change', function() {
    const selectedDate = new Date(this.value);
    const formattedDate = selectedDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    alert(`Consulta agendada para ${formattedDate}`);
    this.style.display = 'none';
  });

  function getUserLocation() {
    if ('geolocation' in navigator) {
      showLoading();
      navigator.geolocation.getCurrentPosition(
        position => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          getLocationName(userLocation);
        },
        error => {
          hideLoading();
          alert('Não foi possível obter sua localização. Por favor, tente novamente.');
        }
      );
    } else {
      alert('Seu navegador não suporta geolocalização.');
    }
  }

  function getLocationName(location) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`)
      .then(response => response.json())
      .then(data => {
        const city = data.address.city || data.address.town || data.address.village || '';
        const state = data.address.state || '';
        const postcode = data.address.postcode || 'CEP não disponível';
        
        locationText.innerHTML = `
          ${city}, ${state}<br>
          <span class="location-cep">CEP: ${postcode}</span>
        `;
        locationHeader.style.display = 'block';
        fetchNearbyHospitals(location);
      })
      .catch(error => {
        console.error('Erro ao obter o nome da localização:', error);
        hideLoading();
      });
  }

  function fetchNearbyHospitals(location) {
    const radius = 5000; // 5km
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:${radius},${location.lat},${location.lng});out;`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        hospitals = data.elements.map(hospital => ({
          ...hospital,
          distance: calculateDistance(location.lat, location.lng, hospital.lat, hospital.lon)
        }));
        displayHospitals(hospitals);
        hideLoading();
        initialView.style.display = 'none';
        hospitalList.style.display = 'grid';
      })
      .catch(error => {
        console.error('Erro ao buscar hospitais:', error);
        hideLoading();
      });
  }

  function displayHospitals(hospitals) {
    hospitalList.innerHTML = '';
    hospitals
      .sort((a, b) => a.distance - b.distance)
      .forEach(hospital => {
        const card = createHospitalCard(hospital);
        hospitalList.appendChild(card);
      });
  }

  function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.innerHTML = `
      <h3>${hospital.tags.name || 'Hospital sem nome'}</h3>
      <p><i class="fas fa-map-marker-alt"></i> ${hospital.tags['addr:street'] || 'Endereço não disponível'}</p>
      <p><i class="fas fa-phone"></i> ${hospital.tags.phone || 'Telefone não disponível'}</p>
      <p><i class="fas fa-route"></i> ${hospital.distance.toFixed(2)} km de distância</p>
    `;
    card.addEventListener('click', () => showHospitalDetails(hospital));
    return card;
  }

  function showHospitalDetails(hospital) {
    hospitalList.style.display = 'none';
    hospitalDetails.style.display = 'block';

    detailsContent.innerHTML = `
      <h2>${hospital.tags.name || 'Hospital sem nome'}</h2>
      <p><i class="fas fa-map-marker-alt"></i> ${hospital.tags['addr:street'] || 'Endereço não disponível'}</p>
      <p><i class="fas fa-phone"></i> ${hospital.tags.phone || 'Telefone não disponível'}</p>
      <p><i class="fas fa-clock"></i> ${hospital.tags.opening_hours || 'Horário de funcionamento não disponível'}</p>
      <p><i class="fas fa-route"></i> ${hospital.distance.toFixed(2)} km de distância</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}" target="_blank" class="directions-button">
        <i class="fas fa-directions"></i> Obter direções
      </a>
    `;

    const map = new google.maps.Map(document.getElementById('hospitalMap'), {
      center: { lat: hospital.lat, lng: hospital.lon },
      zoom: 15
    });

    new google.maps.Marker({
      position: { lat: hospital.lat, lng: hospital.lon },
      map: map,
      title: hospital.tags.name || 'Hospital'
    });
  }

  function showHospitalList() {
    hospitalDetails.style.display = 'none';
    hospitalList.style.display = 'grid';
  }

  function searchHospitals() {
    const query = searchInput.value.toLowerCase();
    const filteredHospitals = hospitals.filter(hospital => 
      hospital.tags.name && hospital.tags.name.toLowerCase().includes(query)
    );
    displayHospitals(filteredHospitals);
  }

  function showLoading() {
    loadingIndicator.style.display = 'flex';
  }

  function hideLoading() {
    loadingIndicator.style.display = 'none';
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distância em km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const scheduleButton = document.getElementById('scheduleButton');
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentDate = document.getElementById('appointmentDate');
  const appointmentTime = document.getElementById('appointmentTime');
  const confirmAppointment = document.getElementById('confirmAppointment');

  const doctors = [
    "Dr. Silva", "Dra. Santos", "Dr. Oliveira", "Dra. Rodrigues", 
    "Dr. Ferreira", "Dra. Almeida", "Dr. Pereira", "Dra. Costa"
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  appointmentDate.min = today.toISOString().split('T')[0];

  scheduleButton.addEventListener('click', function() {
    appointmentForm.style.display = 'block';
  });

  confirmAppointment.addEventListener('click', function() {
    const selectedDate = new Date(appointmentDate.value);
    const selectedTime = appointmentTime.value;

    if (appointmentDate.value && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

      const messageElement = document.createElement('div');
      messageElement.className = 'appointment-message';
      messageElement.textContent = `Consulta agendada com sucesso para ${formattedDate} às ${selectedTime} com ${randomDoctor}.`;

      appointmentForm.style.display = 'none';
      document.getElementById('hospitalDetails').appendChild(messageElement);
    } else {
      alert('Por favor, selecione uma data e um horário para a consulta.');
    }
  });
});
