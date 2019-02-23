package be.ordina.msdashboard.applicationinstance;

import java.net.URI;

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceHealthDataRetrieved;

import org.springframework.boot.actuate.health.Health;
import org.springframework.hateoas.Links;

/**
 * @author Tim Ysewyn
 */
public final class ApplicationInstanceEventMother {

	private ApplicationInstanceEventMother() {
	}

	public static ApplicationInstanceCreated applicationInstanceCreated(String id, String application) {
		return (ApplicationInstanceCreated) ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build()
				.getUncommittedChanges().get(0);
	}

	public static ApplicationInstanceCreated applicationInstanceCreatedWithActuatorEndpoints(String id, String application, Links actuatorEndpoints) {
		return (ApplicationInstanceCreated) ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.actuatorEndpoints(actuatorEndpoints)
				.build()
				.getUncommittedChanges().get(0);
	}

	public static ApplicationInstanceHealthDataRetrieved applicationInstanceHealthDataRetrieved(String id, String application, Health health) {
		return new ApplicationInstanceHealthDataRetrieved(ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted(), health);
	}

	public static ApplicationInstanceDeleted applicationInstanceDeleted(String id, String application) {
		ApplicationInstance applicationInstance = ApplicationInstance.Builder
				.forApplicationWithId(application, id)
				.baseUri(URI.create("http://localhost:8080"))
				.build().markChangesAsCommitted();
		applicationInstance.delete();
		return (ApplicationInstanceDeleted) applicationInstance
				.getUncommittedChanges().get(0);
	}
}
