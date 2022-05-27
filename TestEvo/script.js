const request = new XMLHttpRequest();
request.open('GET', 'https://24mfc.ru/api/v1/organizations/?per-page=200&search=%7B%22isMFC%22:%221%22%7D');

let data;

request.onloadend = function () { // получаем значения и парсим их для последующей работы
  data = request.responseText;
  data = JSON.parse(data);
  getPosition();
}

request.send();

function getPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getDeviceCoord);
  }
  else {
    alert("Ваш браузер не может определить местоположение вашего устройства");
  }
}

function getDeviceCoord(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  setDistance(lat, lng, data);
  sortData(data);
  // if (!isSorted(data)) {
  //   console.log("Записи уже отсортированы, начиная от ближнего");
  // } else {
  //   sortData(data);
  // }
}

function setDistance(latitude, longitude, data) { //функция для нахождения расстояния (если в jsone нет значений, которые можно безопасно пропарсить в number - то ставится null)
  const size = data.length;
  for (let i = 0; i < size; i++) {
    if (isNaN(parseFloat(data[i].lat)) || isNaN(parseFloat(data[i].lng))) {
      data[i].distance = null;
    } else {
      let distance = Math.sqrt(Math.pow((latitude - parseFloat(data[i].lat)), 2) + Math.pow((longitude - parseFloat(data[i].lng)), 2));
      data[i].distance = distance;
    }
  }
}

// function isSorted(data) {
//   for (let i = 1; i < data.length; i++) {
//     if (data[i].distance < data[i - 1].distance) {
//       return false;
//     }
//   }
//   return true;
// }

function sortData(data) { // собственно сортировка

  for (let j = 0; j < data.length - 1; j++) {

    let min = Infinity;
    let index = null;

    for (let i = 0; i < data.length - j; i++) {
      if (data[i].distance < min) {
        min = data[i].distance;
        temp = data[i];
        index = i;
      }
    }

    let buff = data[data.length - 1 - j];
    data[data.length - 1 - j] = temp;
    data[index] = buff;
  }
  console.log(data);
}
