package be.ordina.msdashboard.applicationinstance;

import java.net.URI;

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthDataRetrieved;

import org.springframework.boot.actuate.health.Health;

/**
 * @author Tim Ysewyn
 */
public final class ApplicationInstanceEventMother {

	private ApplicationInstanceEventMother() {
	}

	public static ApplicationInstanceCreated applicationInstanceCreated(String id) {
		return (ApplicationInstanceCreated) ApplicationInstance.Builder
				.withId(id)
				.baseUri(URI.create("http://localhost:8080"))
				.build()
				.getUncommittedChanges().get(0);
	}

	public static ApplicationInstanceHealthDataRetrieved applicationInstanceHealthDataRetrieved(String id, Health health) {
		return new ApplicationInstanceHealthDataRetrieved(ApplicationInstance.Builder
				.withId(id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted(), health);
	}
}
