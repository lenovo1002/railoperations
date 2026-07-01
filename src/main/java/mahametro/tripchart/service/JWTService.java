package mahametro.tripchart.service;


import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import mahametro.tripchart.dto.AuthResponse;

@Component
public class JWTService {

	
	public static final String SECRET="PuneMetroTrainOperatorsPuneMetroTrainOperatorsPuneMetroTrainOperators";
	
	//Create Token
	
	public AuthResponse generateToken(String userName) {
		Map<String,Object> claims=new HashMap<>(); //Data Inside Token
		return new AuthResponse(creatToken(claims,userName)) ;
	}
	
	public String creatToken(Map<String,Object> claims,String userName) {
		//Invoke JWT Wrapper
		
		return Jwts.builder().setClaims(claims).setSubject(userName)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis()+ Duration.ofMinutes(60).toMillis())).
				signWith(getSignKey(),SignatureAlgorithm.HS256).compact();
				
	}
	
	private Key getSignKey() {
		byte[] keyBytes=Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	//Extract Token
	
	private Claims extractAllClaims(String token) {
		
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build()
				.parseClaimsJws(token).getBody();
		
	}
	
	public <T> T extractClaim(String token,Function<Claims,T> claimsResolver) {
		final Claims claims=extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	//Extract UserName from the Token
	public String extractUserName(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	//Extract ExpirationTime from the Token
	public Date extractExpirationTime(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	//Validate the token
	private boolean isTokenExpired(String token) {
		return extractExpirationTime(token).before(new Date());
	}
	
	public Boolean validateToken(String token,UserDetails userDetails) {
		final String userName=extractUserName(token);
		return userName.equals(userDetails.getUsername()) && !isTokenExpired(token);	
	}
}
