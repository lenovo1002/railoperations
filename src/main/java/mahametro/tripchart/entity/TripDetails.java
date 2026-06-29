package mahametro.tripchart.entity;

import java.time.LocalTime;
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
import mahametro.tripchart.enums.Line;
import mahametro.tripchart.enums.SignOnOffLocation;

@Entity
@Table(name = "tbl_trip_details")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TripDetails {
	@Id
	@Column(name = "duty_no" )
	private Integer dutyNo; 
	
	@Column(name = "sign_on_location" , nullable =  false , length = 5)
	@Enumerated(EnumType.STRING)
	private SignOnOffLocation signOnLocation; 
	
	@Column(name = "sign_on_time")
	private LocalTime signOnTime;
	
	@Column(name = "sign_off_location" , nullable =  false , length = 5)
	@Enumerated(EnumType.STRING)
	private SignOnOffLocation signOffLocation;
	
	@Column(name = "sign_off_time")
	private LocalTime signOffTime;
	@Column(name = "line" , nullable =  false , length = 6)
	@Enumerated(EnumType.STRING)
	private Line line;
	
	@JsonManagedReference
    @OneToMany(
            mappedBy = "tripDetails",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TripTime> tripTime;
	
	public TripDetails () {}

	public TripDetails(Integer dutyNo, SignOnOffLocation signOnLocation, LocalTime signOnTime,
			SignOnOffLocation signOffLocation, LocalTime signOffTime, Line line, List<TripTime> tripTime) {
		super();
		this.dutyNo = dutyNo;
		this.signOnLocation = signOnLocation;
		this.signOnTime = signOnTime;
		this.signOffLocation = signOffLocation;
		this.signOffTime = signOffTime;
		this.line = line;
		this.tripTime = tripTime;
	}

	public Integer getDutyNo() {
		return dutyNo;
	}

	public SignOnOffLocation getSignOnLocation() {
		return signOnLocation;
	}

	public LocalTime getSignOnTime() {
		return signOnTime;
	}

	public SignOnOffLocation getSignOffLocation() {
		return signOffLocation;
	}

	public LocalTime getSignOffTime() {
		return signOffTime;
	}

	public Line getLine() {
		return line;
	}

	public List<TripTime> getTripTime() {
		return tripTime;
	}

	public void setDutyNo(Integer dutyNo) {
		this.dutyNo = dutyNo;
	}

	public void setSignOnLocation(SignOnOffLocation signOnLocation) {
		this.signOnLocation = signOnLocation;
	}

	public void setSignOnTime(LocalTime signOnTime) {
		this.signOnTime = signOnTime;
	}

	public void setSignOffLocation(SignOnOffLocation signOffLocation) {
		this.signOffLocation = signOffLocation;
	}

	public void setSignOffTime(LocalTime signOffTime) {
		this.signOffTime = signOffTime;
	}

	public void setLine(Line line) {
		this.line = line;
	}

	public void setTripTime(List<TripTime> tripTime) {
		this.tripTime = tripTime;
	}

	@Override
	public String toString() {
		return "TripDetails [dutyNo=" + dutyNo + ", signOnLocation=" + signOnLocation + ", signOnTime=" + signOnTime
				+ ", signOffLocation=" + signOffLocation + ", signOffTime=" + signOffTime + ", line=" + line
				+ ", tripTime=" + tripTime + "]";
	}

		

}
