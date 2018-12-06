const zip = '80202'

const button = document.querySelector('.main-button')
button.addEventListener('click', handleClick)

async function handleClick(event) {
	event.preventDefault()
	await fetchStations(zip)
}

const fetchStations = async (zipCode) => {
	const url = `https://developer.nrel.gov/api/alt-fuel-stations/v1.json?access=public&status=E&fuel_type=ELEC&zip=${zipCode}&api_key=PsjK9I6KvaofKMkDXzBX16E9SPRc2HvVCysFsW72&format=JSON`;
	const stationData = await fetchData(url);
	const stationResults = await formatStationData(stationData.fuel_stations);
	console.log(stationResults)
	return stationResults;
}

const fetchData = async (url) => {
	const response = await fetch(url);
	const responseJson = await response.json();
	return responseJson;
};

const formatStationData = async (stations) => {
	const stationPromises = stations.map(async station => {
		const {
			station_name,
			station_phone,
			latitude,
			longitude,
			street_address,
			city,
			state,
			zip,
			intersection_directions,
			access_days_time
		} = station

		return {
	    station_name: station_name,
	    station_phone: station_phone,
	    latitude: latitude,
	    longitude: longitude,
	    street_address: street_address,
	    city: city,
	    state: state,
	    zip_code: zip,
	    intersection_directions: intersection_directions,
	    access_days_time: access_days_time,
	    cafes: await fetchCafes(`${latitude},${longitude}`)
		}
	});
	return Promise.all(stationPromises);
};

const fetchCafes = async (latitudeLongitude) => {
	const url = `https://api.foursquare.com/v2/venues/search?client_id=3E2HW22GFIF5JPKWRKF1XBHOTP5JFPO0EOWBZWCEAQJQIEXC&client_secret=WMGOCBDXCJVSFV0VG0NMQC5HNASM3AAVKKQ5VZEEC5HEOFQA&v=20180323&limit=3&ll=${latitudeLongitude}&query=coffee'&radius=805`;
	const cafeData = await fetchData(url);
	const cafeResults = formatCafeData(cafeData.response.venues);
	return cafeResults;
}

const formatCafeData = (cafes) => {
	const cafePromises = cafes.map(cafe => {
		// console.log(cafe)
		const {
			address,
			city,
			state,
			postalCode,
			crossStreet,
			formattedAddress,
			distance
		} = cafe.location

		return {
		  cafe_name: cafe.name,
      street_address: address,
      city: city,
      state: state,
      zip_code: postalCode,
      cross_street: crossStreet,
      formatted_address: `${formattedAddress[0]}, ${formattedAddress[1]}, ${formattedAddress[2]}`,
      distance_in_meters: distance,
		}
	});
	return Promise.all(cafePromises);
};