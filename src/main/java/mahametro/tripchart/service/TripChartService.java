package mahametro.tripchart.service;

import java.util.Comparator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import mahametro.tripchart.entity.TripDetails;
import mahametro.tripchart.entity.TripTime;
import mahametro.tripchart.repository.TripRepo;

@Service
public class TripChartService {
	@Autowired
	private TripRepo tripRepo ;
	
	public ResponseEntity<?> addTrip(TripDetails tripDetail) {
		if (tripDetail == null) return ResponseEntity.badRequest().build() ;
		if (tripRepo.existsById(tripDetail.getDutyNo())) return ResponseEntity.badRequest().header("MSG", "Duty number already exists").build() ;
	
		
		for (TripTime tt : tripDetail.getTripTime()) {
		    tt.setTripDetails(tripDetail);
		}
		
		TripDetails savedTrip = tripRepo.save(tripDetail);

		return ResponseEntity.ok(savedTrip);
		
	}
	
	public ResponseEntity<TripDetails> getTripDetails(Integer dutyNo){
		if (!tripRepo.existsById(dutyNo)) return ResponseEntity.notFound().header("Error ! ", "Duty number not found ! ").build() ;
		
		
		
		

		return tripRepo.findById(dutyNo)
		        .map(trip -> {
		        	
		        	if (dutyNo == 139) {
		        	
		            trip.getTripTime().sort(
		                Comparator.comparing(TripTime::getTripStartsFrom)
		            );
		            return ResponseEntity.ok().body(trip); }
		        	
		        	else {trip.getTripTime().sort(
			                Comparator.comparing(TripTime::getTripStartTime)
				            );
				            return ResponseEntity.ok().body(trip); }
		        })
		        .orElseThrow(() -> new RuntimeException("Duty not found"));
		
		
		
		
		
//		return tripRepo.findById(dutyNo)
//		        .map(trip -> {
//		            trip.getTripTime().sort(
//		                Comparator.comparing(TripTime::getTripStartTime)
//		            );
//		            return ResponseEntity.ok().body(trip);
//		        })
//		        .orElseThrow(() -> new RuntimeException("Duty not found"));
	}

}
