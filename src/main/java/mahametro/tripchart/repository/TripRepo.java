package mahametro.tripchart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mahametro.tripchart.entity.TripDetails;

public interface TripRepo extends JpaRepository<TripDetails, Integer> {

}
