package mahametro.tripchart.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import mahametro.tripchart.enums.SignOnLocation;

@Entity
@Table(name = "tbl_trip_details")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TripDetails {
	@Id
	@Column(name = "duty_no" )
	private Integer dutyNo; 
	@Column(name = "sign_on" , nullable =  false , length = 5)
	@Enumerated(EnumType.STRING)
	private SignOnLocation signOn; 
	
	@JsonManagedReference
    @OneToMany(
            mappedBy = "tripDetails",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TripTime> tripTime;
	
	public TripDetails(Integer dutyNo, SignOnLocation signOn,
			List<TripTime> tripTime) {
		super();
		this.dutyNo = dutyNo;
		this.signOn = signOn;
		this.tripTime = tripTime;
	}




	public List<TripTime> getTripTime() {
		return tripTime;
	}




	public void setTripTime(List<TripTime> tripTime) {
		this.tripTime = tripTime;
	}




	public TripDetails() {
		super();
		// TODO Auto-generated constructor stub
	}




	public TripDetails(Integer dutyNo, SignOnLocation signOn) {
		super();
		this.dutyNo = dutyNo;
		this.signOn = signOn;
	}




	public Integer getDutyNo() {
		return dutyNo;
	}




	public SignOnLocation getSignOn() {
		return signOn;
	}











	public void setDutyNo(Integer dutyNo) {
		this.dutyNo = dutyNo;
	}




	public void setSignOn(SignOnLocation signOn) {
		this.signOn = signOn;
	}




	
	
	

}
