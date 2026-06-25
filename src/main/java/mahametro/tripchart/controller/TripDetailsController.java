package mahametro.tripchart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mahametro.tripchart.entity.TripDetails;
import mahametro.tripchart.service.TripChartService;
@CrossOrigin("http://localhost:5173/")
@RestController
@RequestMapping("tripchart")
public class TripDetailsController {
	
	@Autowired
	private TripChartService tripService ;
	
	@GetMapping("/{dutyNo}")
	public ResponseEntity<?> getByDutyNo(@PathVariable Integer dutyNo) {
		return tripService.getTripDetails(dutyNo);
	}
	
	@PostMapping("addtrip")
	public ResponseEntity<?> addTrip (@RequestBody TripDetails tripDetails) {
		
		
		return tripService.addTrip(tripDetails);
	}

}
