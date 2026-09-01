// ================================
// Horarios de Ómnibus
// ================================
const schedules = {
  'weekday': {
    '11a-ida': ['03:45', '04:15', '04:50', '05:15', '05:32', '05:50', '06:10', '06:18', '06:25', '06:43', '07:03', '07:10', '07:26', '07:40', '07:50', '08:05', '08:10', '08:40', '09:05', '09:40', '09:45', '10:05', '10:35', '10:55', '11:10', '11:30', '12:00', '12:10', '12:30', '12:45', '13:00', '13:10', '13:30', '13:55', '14:26', '14:45', '14:55', '15:00', '15:20', '15:40', '16:00', '16:15', '16:40', '17:00', '17:15', '17:35', '18:15', '18:30', '19:00', '19:20', '19:45', '20:10', '20:45', '21:30', '22:20', '23:25', '00:50'],
    '11a-sauce': ['04:55', '05:40', '06:45', '07:30', '08:15', '09:00', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '14:55', '15:43', '16:05', '16:43', '17:20', '17:45', '18:20', '19:00', '19:50', '20:30', '21:25', '21:55', '22:50', '23:59'],
    '6a-ida': ['06:00', '07:00', '08:20', '09:20', '10:25', '11:15', '11:40', '12:30', '13:25', '14:20', '15:10', '15:35', '16:10', '16:50', '17:20', '17:55', '18:35', '19:10', '20:00', '20:55', '21:45', '22:40', '23:45'],
    '6a-sauce': ['04:20', '05:20', '05:55', '06:20', '06:40', '07:20', '07:45', '08:15', '09:10', '10:05', '10:55', '11:45', '12:45', '13:30', '14:15', '15:00', '15:45', '16:45', '17:10', '18:00', '18:45', '19:20', '20:45', '22:15']
  },
  'saturday': {
    '11a-ida': ['04:00', '05:00', '05:50', '06:15', '06:58', '07:35', '08:05', '08:35', '09:10', '09:50', '10:00', '10:25', '10:47', '11:15', '11:45', '13:05', '14:05', '14:35', '15:00', '15:45', '16:20', '17:15', '18:35', '18:50', '19:30', '20:20', '21:10', '22:20', '23:25'],
    '11a-sauce': ['04:55', '05:40', '06:45', '07:30', '08:15', '09:00', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '14:55', '15:43', '16:05', '16:43', '17:20', '17:45', '18:20', '19:00', '19:50', '20:30', '21:25', '21:55', '22:50', '23:59'],
    '6a-ida': ['06:15', '08:00', '09:20', '10:55', '11:50', '12:55', '14:10', '15:30', '16:35', '18:15', '19:40', '21:00', '22:20', '23:10'],
    '6a-sauce': ['04:30', '06:15', '07:25', '08:30', '09:50', '11:00', '12:25', '13:30', '14:25', '16:00', '17:15', '19:00', '20:00', '21:30']
  },
  'sunday': {
    '11a-ida': ['04:19', '05:00', '05:50', '06:40', '07:50', '08:35', '09:10', '09:50', '10:05', '11:00', '12:10', '13:10', '14:20', '15:40', '16:30', '17:30', '18:35', '19:00', '19:45', '21:15', '22:20', '23:10'],
    '11a-sauce': ['05:00', '05:55', '06:45', '08:00', '09:25', '10:45', '11:20', '12:03', '13:05', '14:00', '14:50', '16:15', '17:45', '18:10', '19:30', '20:15', '20:55', '22:00', '23:00', '23:59'],
    '6a-ida': ['06:15', '08:30', '10:25', '12:00', '14:30', '16:30', '18:05', '20:20', '22:15'],
    '6a-sauce': ['04:30', '06:35', '08:45', '10:20', '12:35', '14:30', '16:35', '18:30', '20:35']
  }
};

// Horarios especiales (8 de Octubre, terminales)
const specialHours = {
  '6a-sauce': ['06:40', '09:10'],
  '6a-ida': ['16:50']
};

// Estado actual
let currentRoute = 'ida';

// ================================
// Funciones Auxiliares
// ================================

/**
 * Determina el tipo de horario según el día de la semana
 */
function getScheduleType(date) {
  const day = date.getDay();
  if (day === 0) return 'sunday';
  if (day === 6) return 'saturday';
  return 'weekday';
}

/**
 * Obtiene el nombre del día en español
 */
function getDayName(date) {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return days[date.getDay()];
}

/**
 * Convierte formato HH:MM a minutos
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// ================================
// Control de Rutas
// ================================

/**
 * Cambia la ruta activa
 */
function switchRoute(route) {
  currentRoute = route;
  
  // Actualizar botones
  document.querySelectorAll('.route-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-route="${route}"]`).classList.add('active');
  
  // Actualizar display
  updateDisplay();
}

// ================================
// Renderizado de Horarios
// ================================

/**
 * Renderiza los horarios en una columna
 */
function renderSchedule(times, elementId, currentMinutes, specialList) {
  const list = document.getElementById(elementId);
  list.innerHTML = '';
  
  let nextFound = false;
  const lastTime = times[times.length - 1];
  
  times.forEach(time => {
    const minutes = timeToMinutes(time);
    const li = document.createElement('li');
    li.className = 'schedule-item';
    li.textContent = time;
    
    // Marcar horarios especiales (8 de Octubre + terminales)
    if (specialList && specialList.includes(time)) {
      li.classList.add('special');
    }
    
    if (time === lastTime) {
      li.classList.add('special');
    }
    
    // Marcar próximo ómnibus
    if (!nextFound && minutes > currentMinutes) {
      li.classList.add('next');
      nextFound = true;
    }
    // Marcar horarios pasados
    else if (minutes <= currentMinutes) {
      li.classList.add('passed');
    }
    
    list.appendChild(li);
  });
}

// ================================
// Actualización de Display
// ================================

/**
 * Actualiza toda la información mostrada
 */
function updateDisplay() {
  const now = new Date();
  const scheduleType = getScheduleType(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Actualizar hora actual
  const timeStr = now.toLocaleTimeString('es-UY', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  document.getElementById('currentTime').textContent = timeStr;
  
  // Actualizar día
  const dayName = getDayName(now);
  const dayTypeText = scheduleType === 'weekday' ? '(Entre semana)' : 
                      scheduleType === 'saturday' ? '(Sábado)' : '(Domingo)';
  document.getElementById('dayInfo').textContent = `${dayName} ${dayTypeText}`;
  
  // Obtener horarios del día actual
  const current = schedules[scheduleType];
  const suffix = currentRoute === 'ida' ? '-ida' : '-sauce';
  
  const times11a = current[`11a${suffix}`];
  const times6a = current[`6a${suffix}`];
  
  const specialList6a = specialHours[`6a${suffix}`] || [];
  
  // Renderizar ambas columnas
  renderSchedule(times11a, 'scheduleColumn11a', currentMinutes, null);
  renderSchedule(times6a, 'scheduleColumn6a', currentMinutes, specialList6a);
}

// ================================
// Inicialización
// ================================

// Actualizar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();
  
  // Actualizar cada 30 segundos
  setInterval(updateDisplay, 30000);
});
