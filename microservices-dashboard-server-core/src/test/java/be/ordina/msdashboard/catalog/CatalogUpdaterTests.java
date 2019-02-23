package be.ordina.msdashboard.catalog;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;
import be.ordina.msdashboard.applicationinstance.ApplicationInstanceEventMother;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;
import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceDeleted;
import be.ordina.msdashboard.discovery.ServiceDiscoveryEventMother;
import be.ordina.msdashboard.discovery.events.ServiceDisappeared;
import be.ordina.msdashboard.discovery.events.ServiceDiscovered;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

/**
 * @author Tim Ysewyn
 */
@RunWith(MockitoJUnitRunner.class)
public class CatalogUpdaterTests {

	@Mock
	private CatalogService catalogService;

	@InjectMocks
	private CatalogUpdater catalogUpdater;

	@Captor
	private ArgumentCaptor<ApplicationInstance> applicationInstanceArgumentCaptor;

	@Test
	public void applicationShouldBeAddedToCatalogWhenNewServiceIsDiscovered() {
		ServiceDiscovered event = ServiceDiscoveryEventMother.newServiceDiscovered("a");
		this.catalogUpdater.addNewApplicationToCatalog(event);
		verify(this.catalogService).addApplicationToCatalog("a");
	}

	@Test
	public void applicationShouldBeRemovedFromCatalogWhenServiceHasDisappeared() {
		ServiceDisappeared event = ServiceDiscoveryEventMother.serviceDisappeared("a");
		this.catalogUpdater.removeApplicationFromCatalog(event);
		verify(this.catalogService).removeApplicationFromCatalog("a");
	}

	@Test
	public void applicationInstanceShouldBeAddedToCatalogWhenApplicationInstanceIsCreated() {
		ApplicationInstanceCreated event = ApplicationInstanceEventMother.applicationInstanceCreated("a-1", "a");
		this.catalogUpdater.addNewApplicationInstanceToCatalog(event);
		verify(this.catalogService).addApplicationInstanceToCatalog(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance).isNotNull();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

	@Test
	public void applicationInstanceShouldBeRemovedFromCatalogWhenApplicationInstanceIsDeleted() {
		ApplicationInstanceDeleted event = ApplicationInstanceEventMother.applicationInstanceDeleted("a-1", "a");
		this.catalogUpdater.removeApplicationInstanceFromCatalog(event);
		verify(this.catalogService).removeApplicationInstanceFromCatalog(this.applicationInstanceArgumentCaptor.capture());
		ApplicationInstance applicationInstance = this.applicationInstanceArgumentCaptor.getValue();
		assertThat(applicationInstance).isNotNull();
		assertThat(applicationInstance.getId()).isEqualTo("a-1");
	}

}
