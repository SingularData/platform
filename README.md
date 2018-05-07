# SingularData

[SingularData](https://singulardata.github.io/) is a platform to connect hundreds of open data portals and provide cross-portal dataset search service.

![preview](image/preview.png)

## Problem

It is obvious that open data is a popular concept and is being adopted by more and more organizations. Though numerous effort has been made in the data opening, finding the right dataset is still an uneasy task.

One of the difficulties in data searching is from the number of data sources and the various data/metadata format they are providing. Sometimes a user needs to search in multiple data portals and reads data metadata in different formats before getting his data, if he is lucky. Navigating through a portal without no finds and then starting with a new one is an disappointing and inefficient process.

## Idea

SingularDat collects data metadata from hundreds of data sources and create our own search index. With one single search box, the user is able to find dataset in the whole search space. There is no wondering on if the dataset exists at another portal or not. If your dataset exists, it should be presented by the platform, no matter where it is from.

As the platform standardizes data metadata from different sources, the user is able to read the metadata in an easy and friendly format. No more pain of jumping among formats!

## Engineering

This repository hosts the web application of SingularData. For details on data search, check the [API repo](https://github.com/SingularData/api). For details on data harvesting, check the [data engine repo](https://github.com/SingularData/data-engine).

## License MIT

MIT
