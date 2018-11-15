package be.ordina.msdashboard;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Tim Ysewyn
 */
@Configuration
public class MicroservicesDashboardServerAutoConfiguration {

	@Bean
	LandscapeWatcher landscapeWatcher(DiscoveryClient discoveryClient) {
		return new LandscapeWatcher(discoveryClient);
	}


}
