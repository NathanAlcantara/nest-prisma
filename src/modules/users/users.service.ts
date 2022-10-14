import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { map } from 'rxjs';
import { ListUserInput } from './user.dto';

@Injectable()
export class UsersService {
  private token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlNyUG4ta2FydVN1TDV0UXNNa0cySCJ9.eyJpc3MiOiJodHRwczovL2F1dGgtbmF0aGFuLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJuQnB5SVlrOHBpRDJCQjhENGVtQjZEV2lEdW9mMjB1MUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLW5hdGhhbi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY2NTcxMjE0MSwiZXhwIjoxNjY1Nzk4NTQxLCJhenAiOiJuQnB5SVlrOHBpRDJCQjhENGVtQjZEV2lEdW9mMjB1MSIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmFjdGlvbnNfbG9nX3Nlc3Npb25zIHJlYWQ6b3JnYW5pemF0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcnMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVycyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyB1cGRhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIGNyZWF0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.frPaO3Mz9Ju2T4tlc_Tx8xXNLyFayL5GNJDJxzwcoOeXMlmW-Ayi43WGPe9IcD2HmW1LKNE3yRcbImU-gabNqTJnh_vzi1K8wOucV0AabuOK4-rQZN3iN265xN4YTazEwbd2YlZkIQL8WnM0mGphpRfV3cTSCZK5NPsvVo3-_enBwmdCt7GUWnCQV8_sSEUFSO2jnoIUO_TdpYiINQIcgW-QUcIV9OK4kY5znERq39ZVpFCUOeHQqO5EgCUdVsedFV6KZSMHV4yiceVM_tZHFzDUFtti2n4MaSOIfKH2X6rvoP_O8pLlFtcKTKTYFbmjcxrbCf1Tblxmla-s9Oeulw';

  private baseUrl = 'https://auth-nathan.us.auth0.com/api/v2/users';

  constructor(private http: HttpService) {}

  findMany(listUserInput: ListUserInput) {
    const order = listUserInput.sortOrder === Prisma.SortOrder.asc ? 1 : -1;

    const orderBy = listUserInput.orderBy
      ? `${listUserInput.orderBy}:${order}`
      : undefined;

    return this.http
      .get(this.baseUrl, {
        params: {
          page: listUserInput.page - 1,
          per_page: listUserInput.pageSize,
          include_totals: true,
          sort: orderBy,
          fields: 'email,name',
          include_fields: true,
          q: listUserInput.q,
          search_engine: 'v3',
        },
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(map((value) => value.data));
  }

  // findUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
  //   return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  // }

  // findMany(listUserInput: ListUserInput): Promise<User[]> {
  //   const skip = (listUserInput.page - 1) * listUserInput.pageSize;
  //   const take = listUserInput.pageSize;

  //   const orderBy = listUserInput.orderBy
  //     ? {
  //         [listUserInput.orderBy]: listUserInput.sortOrder,
  //       }
  //     : undefined;

  //   return this.prisma.user.findMany({
  //     skip: Number(skip) || undefined,
  //     take: Number(take) || undefined,
  //     where: listUserInput.where,
  //     orderBy: orderBy,
  //     select: this.selectWithoutPassword,
  //   });
  // }

  // count(userWhereInput: Prisma.UserWhereInput): Promise<number> {
  //   return this.prisma.user.count({
  //     where: userWhereInput,
  //   });
  // }

  // create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
  //   return this.prisma.user.create({
  //     data: userCreateInput,
  //   });
  // }

  // update(
  //   userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  //   userUpdateInput: Prisma.UserUpdateInput,
  // ): Promise<User> {
  //   return this.prisma.user.update({
  //     where: userWhereUniqueInput,
  //     data: userUpdateInput,
  //     select: this.selectWithoutPassword,
  //   });
  // }

  // delete(id: string): Promise<User> {
  //   return this.prisma.user.delete({
  //     where: { id },
  //     select: this.selectWithoutPassword,
  //   });
  // }
}
