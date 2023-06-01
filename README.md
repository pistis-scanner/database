# Fearlessmole Database

This project contains the advisories databases (based on github databases) with some more added information (like vulnerable methods when found in the advisory description) and a set os scripts to process the databases per language.

We generate a single json file per language, so when you run the tool to find vulnerabilities you only check against the vulenrabilities for that language

## Structure
```text
|
|--- README.md. 
|--- advisories - Advisory database folder. This should be similar to the github advisory database, with the added info. 
|--- worker - The scripts to manage the db
|-------advisory-database - The github advisory database as of 2023-05-02, we use this to generate our database databases. While we don't finish parsing the entire database for python this folder will be kept here so we can finish for the current advisories, and in the future we will only check new commits from this point in time forward. 
```

## Usage

```
cd worker
```

### Generating Databases per language

```node
ts-node src/CreateDbFilePerLanguage.ts
```


### Process Vulnerable Methods for advisories

We use chatgpt to try to identify the vulnerable method in an advisory, for that we run PatchGithubDatabase.ts
You need to change the script to add your own api key at this moment. Also you may need to change the script to read more/less adivosries. Currently configured to 2023 only

#### Review results

Finally there's another script called ReviewDBVulnerableMethods.ts that crawls all advisories that have a method identified and prompts it to the user to verify. Either type 'y' to confirm that's the right method, or type yourself the right method (if you leave empty it will be cleared)
