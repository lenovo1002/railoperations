package mahametro.tripchart.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mahametro.tripchart.dto.AuthResponse;
import mahametro.tripchart.entity.AuthRequest;
import mahametro.tripchart.entity.UserInfo;
import mahametro.tripchart.service.JWTService;
import mahametro.tripchart.service.UserInfoService;


@RestController
@RequestMapping("/admin")
public class UserController {
	
	@Autowired
	private UserInfoService userService;
	
	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private JWTService jwtService;
	
	@PostMapping(value="/new")
	public String addNewUser(@RequestBody UserInfo userInfo) {
		return userService.addUser(userInfo);
	}
	
	@GetMapping(value="/welcome")
	public String welcome() {
		return "Welcome ..And this Endpoint is not secured";
	}
	
	@PostMapping(value="/authenticate")
	public AuthResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
		Authentication authObj=authManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(),
				authRequest.getPassword()));
		
		if(authObj.isAuthenticated()) {
			return jwtService.generateToken(authRequest.getUsername());
		}
		else
		{
			throw new UsernameNotFoundException("Invalid user Request");
		}
			
	}

}
