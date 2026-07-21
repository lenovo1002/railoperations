package mahametro.tripchart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import mahametro.tripchart.entity.Issues;
import mahametro.tripchart.repository.IssueRepo;
import mahametro.tripchart.repository.TripRepo;

@Service
public class IssueService {
	@Autowired
	private IssueRepo issueRepo ;
	@Autowired
	private TripRepo tripRepo;
	
	public ResponseEntity<?> addIssue (Issues issue) {
		
		if (!tripRepo.existsById(issue.getDuty_no())) return ResponseEntity.notFound().header("MSG", "Duty number not found").build() ;
		Issues savedIssse = issueRepo.save(issue) ;
		return ResponseEntity.ok(savedIssse);
	}
	
	public Iterable <Issues> getAllIssues () {
		return issueRepo.findAll() ;
	}

}
