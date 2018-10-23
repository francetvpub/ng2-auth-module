export interface JsonIdentity {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  groups: string;
  profile: string;
}

export class Identity {
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  groups: string[];
  profile: string;

  constructor(jsonIdentity: JsonIdentity) {
    this.login = jsonIdentity.sub;
    this.email = jsonIdentity.email;
    this.firstName = jsonIdentity.given_name;
    this.lastName = jsonIdentity.family_name;
    this.groups = jsonIdentity.groups.split(',');
    this.profile = jsonIdentity.profile;
  }
}
