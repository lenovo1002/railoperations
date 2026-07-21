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

import mahametro.tripchart.entity.Issues;
import mahametro.tripchart.entity.TripDetails;
import mahametro.tripchart.service.IssueService;
import mahametro.tripchart.service.TripChartService;
@RestController
@RequestMapping("tripchart")
@CrossOrigin("https://metroduty.in")
public class TripDetailsController {
	
	@Autowired
	private TripChartService tripService ;
	@Autowired
	private IssueService issueService ;
	
	@GetMapping("/{dutyNo}")
	public ResponseEntity<?> getByDutyNo(@PathVariable Integer dutyNo) {
		return tripService.getTripDetails(dutyNo);
		
		
	}
	
	@PostMapping("/addalltrip") 
	public ResponseEntity addAllTrips(@RequestBody Iterable<TripDetails> allTrips) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return tripService.saveAllTrips(allTrips);
	}
	
	@PostMapping("/addtrip")
	public ResponseEntity<?> addTrip (@RequestBody TripDetails tripDetails) {
		
		
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return tripService.addTrip(tripDetails);
	}
	
	@GetMapping("/test") 
	public String test() {
		return "Yahoo, Server is up !";
	}
	
	@PostMapping("/raiseissue") 
	public ResponseEntity<?> raisedIssue (@RequestBody Issues issue) {
		return issueService.addIssue(issue);
	}
	
	
	@GetMapping ("/viewallissues")
	public Iterable<Issues> getAllissues () {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return issueService.getAllIssues() ;
	}
		
	
	
	
	

}
