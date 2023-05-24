# cdf-hydapi-stations
ArcGIS Server Custom Data Feed som henter data om hydrologiske målestasjoner fra NVEs hydapi.

#### Forutsetninger
For å utvikle en custom data feed trenger du å installere Node.js og ArcGIS Enterprise SDK.

#### Opprette kodemal
Lag et repository i GitHub og clone til utviklingsmaskinen. 

Åpne repositoriet i VS Code og et terminalvindu.

Lage en ny app
```
cdf createapp hydapi_stations_app
```

Bytte til katalogen
```
cd hydapi_stations_app
```

Opprette en ny provider
```
cdf createprovider hydapi_stations_cdf
```
#### Utvikle en provider
Å lage en provider innebærer å fylle funksjonen getData() i src/model.js med innhold. Kort fortalt skal du skrive kode som henter data fra ønsket kilde og returnere disse som geojson. Husk at geojson forventer WGS84 (4326). Her kan du bruke alle tilgjengelige moduler til node for å hente data fra ulike kilder. I dette eksempelet benyttes request for å gjøre et https kall til et REST API. Husk å installere node-modulen request for provideren (gå til katalogen til provideren)

```
cd providers
cd hydapi_stations_cdf
npm install request
```

Ved utvikling av provider er det et par ting å tenke på. Det er mulig å sende med et hostnavn og en id fra featuretjenesten som mottar dataene. Om du ikke har bruk for dette, så må du endre til følgende innstillinger i cdconfig.json (sette hosts til false og disableIdParam til true).
```
 "properties": {
    "hosts": false,
    "disableIdParam": true
  }
```

Når du lager geometri må denne være i WGS84 og desimalgrader. Husk også at koordinatene må være tall og ikke tekst.
```
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [feature['longitude'], feature['latitude']] // longitude først og så latitude
  },
  "properties": feature
}
```


##### Eksportere en ferdig provider-pakke
```
cdf export hydapi_stations_cdf
```

#### Laste opp provideren til ArcGIS Server
En custom data provider pakke må lastes opp og registreres på ArcGIS Server siten som benyttes av Enterprise. Dette gjøres via admin-grensesnittet f.eks. https://vmgdts02.azure.geodata.no:6443/arcgis/admin

Gå til
home/uploads/upload 
for å laste opp *.cdpk

Kopiere id som returneres når filen er lastet opp

#### Registrere data feeden med ArcGIS Server
I admin-grensesnittet, gå til:
home/services/types/customdataproviders/register
for å registrere provideren med id-kopiert i forrige steg.

#### Opprette en feature service som mottar data fra feeden
I admin-grensesnittet gå til:
home/services/createService

Bruk følgende mal for å opprette en ny feature service. Pass på at type er "FeatureServer" og capabilities er "Query" (read only). Navnet på dataprovideren må også være helt likt 

```
{
  "serviceName": "hydapi_stations",
  "type": "FeatureServer",
  "description": "Hydrological stations from api.nve.no",
  "capabilities": "Query",
  "provider": "CUSTOMDATA",
  "clusterName": "default",
  "minInstancesPerNode": 0,
  "maxInstancesPerNode": 0,
  "instancesPerContainer": 1,
  "maxWaitTime": 60,
  "maxStartupTime": 300,
  "maxIdleTime": 1800,
  "maxUsageTime": 600,
  "loadBalancing": "ROUND_ROBIN",
  "isolationLevel": "HIGH",
  "configuredState": "STARTED",
  "recycleInterval": 24,
  "recycleStartTime": "00:00",
  "keepAliveInterval": 1800,
  "private": false,
  "isDefault": false,
  "maxUploadFileSize": 0,
  "allowedUploadFileTypes": "",
  "properties": {"disableCaching": "true"},
  "portalProperties": {"isHosted": false},
  "jsonProperties": {
    "customDataProviderInfo": {
      "dataProviderName": "hydapi_stations_cdf",
      "dataProviderHost": "",
      "dataProviderId": ""
    }
  },
  "extensions": [],
  "frameworkProperties": [],
  "datasets": []
}
```
Her ser du at dataProviderHost og dataProviderid er satt til "" da disse ikke brukes. Dette speiler innstillingene i cdconfig.json (se tidligere beskrivelser).


