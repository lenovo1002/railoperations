package mahametro.tripchart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mahametro.tripchart.entity.TripDetails;
import mahametro.tripchart.service.TripChartService;
@RestController
@RequestMapping("tripchart")
@CrossOrigin("http://localhost:3000")
public class TripDetailsController {
	
	@Autowired
	private TripChartService tripService ;
	
	@GetMapping("/{dutyNo}")
	public ResponseEntity<?> getByDutyNo(@PathVariable Integer dutyNo) {
		return tripService.getTripDetails(dutyNo);
		
		
	}
	
	@PostMapping("/addtrip")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<?> addTrip (@RequestBody TripDetails tripDetails) {
		
		
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		System.out.println("Authentication = " + auth);
		System.out.println("Principal = " + auth.getPrincipal());
		System.out.println("Authorities = " + auth.getAuthorities());
		System.out.println("Authenticated = " + auth.isAuthenticated());
		return tripService.addTrip(tripDetails);
	}
	
	@GetMapping("/test") 
	public String test() {
		return "Yahoo, Server is up !";
	}

}
