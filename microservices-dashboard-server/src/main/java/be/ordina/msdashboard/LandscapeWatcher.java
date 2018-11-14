package be.ordina.msdashboard;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.event.HeartbeatEvent;
import org.springframework.context.event.EventListener;

/**
 * @author Tim Ysewyn
 */
public class LandscapeWatcher {

	private final DiscoveryClient discoveryClient;

	public LandscapeWatcher(DiscoveryClient discoveryClient) {
		this.discoveryClient = discoveryClient;
	}

	@EventListener({HeartbeatEvent.class})
	public void checkForChangesInLandscape() {
		System.out.println("TEST!");
	}

}