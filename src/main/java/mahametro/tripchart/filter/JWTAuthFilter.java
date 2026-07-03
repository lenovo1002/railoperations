package mahametro.tripchart.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mahametro.tripchart.config.UserInfoUserDetailsService;
import mahametro.tripchart.service.JWTService;

@Component
public class JWTAuthFilter extends OncePerRequestFilter{
	
	
	@Autowired
	private JWTService jwtService;
	
	@Autowired
	private UserInfoUserDetailsService userService;

	//This is the filter which developer need to override based on JWT Logic
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
	
		//JWT Token ==> Authorization as Header Name
		// VAlue ==> Bearer + "  " + Token
		
		String authHeader=request.getHeader("Authorization"); 
		String token=null;
		String userName=null;
		
		if(authHeader!=null && authHeader.startsWith("Bearer ")) { //Check if its JWT or not
			token=authHeader.substring(7); // "Bearer "
			userName=jwtService.extractUserName(token);
		}
		//SingleSigon on Verfication
		if(userName!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
			//Database Call will be made
			UserDetails userDetails=userService.loadUserByUsername(userName);
			if(jwtService.validateToken(token, userDetails)) {
				//If its valid token
				UsernamePasswordAuthenticationToken authToken= new 
						UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
				//Need to attach our toekn to the session
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
				
				
			}
			
		}
		filterChain.doFilter(request, response); //Regular Logic
	}

}

