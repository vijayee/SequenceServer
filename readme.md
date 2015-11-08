# SequenceServer

Generates small sequences for CouchDB or PouchDB document ids.

# Installation

npm install

# API

## POST "/id"

Returns a new id.

## POST "/prefix"

Returns a new client prefix.

# IDs and prefixes

IDs are meant to be used when saving a new document in CouchDB or PouchDB database, a call to this service will provide an unused ID guaranteeing no collisions within a database when new documents are saved.

Prefixes are used by client applications that will be sending data to a central server. A prefix is requested by a client once and is used for the lifetime of the clients activities.

A client application will prefix all of its IDs with the one provided by the server, guaranteeing no document ID collisions, while using very small IDs.

---

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.