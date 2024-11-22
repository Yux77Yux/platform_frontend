import { UserIncidental, UsernameAndPassword } from '@/src/store/user/user.types';

type ResponseType = {
    userInfo: UserIncidental,
    token: string
} | { err: string };

export const userSignInAsync = async (passport: UsernameAndPassword): Promise<UserIncidental | Error> => {
    const url = "http://localhost:3001/api/user/sign-in";

    try {
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passport)
        })
        const result: ResponseType = await response.json();

        if (!response.ok) {
            throw new Error((result as { err: string }).err);
        }

        localStorage.setItem('token', (result as {
            userInfo: UserIncidental,
            token: string
        }).token);

        const user = (result as {
            userInfo: UserIncidental,
            token: string
        }).userInfo;

        return user;
    } catch (error) {
        return error as Error;
    }
}

export const userSignUpAsync = async (passport: UsernameAndPassword): Promise<null | Error> => {
    const url = "http://localhost:3001/api/user/sign-up";

    try {
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passport)
        });

        const result: null | {
            err: string;
        } = await response.json();

        if (!response.ok) {
            throw new Error((result as { err: string }).err);
        }

        return null;
    } catch (error) {
        return error as Error;
    }
}

export const userSignOutAsync = async (uid: string): Promise<{ success: string } | Error> => {
    const url = "http://localhost:3001/api/user/sign-out";
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("token is empty!");
    }

    try {
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token,
            },
            body: `uid=${encodeURIComponent(uid)}`
        });

        const result: { success: string } | { err: string } = await response.json();

        if (!response.ok) {
            throw new Error((result as { err: string }).err);
        }

        localStorage.removeItem("token");
        return result as { success: string };
    } catch (error) {
        return error as Error;
    }
}

export const fetchUserAsync = async (uid: string): Promise<UserIncidental | Error> => {
    const url = `http://localhost:3001/api/user/fetch-user?uid=${uid}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        const data: { err: string } | UserIncidental = await response.json();
        if (!response.ok) {
            throw new Error(`${(data as { err: string }).err}`);
        }
        return data as UserIncidental;
    } catch (error) {
        return error as Error;
    }
}

export const updateProfileAsync = async (upload: { uid: string, profile: File }): Promise<string | Error> => {
    const url = "http://localhost:3001/api/user/update-profile";

    const formData = new FormData();
    formData.append('uid', upload.uid.toString());
    formData.append('profile', upload.profile);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: formData
        });
        const result: { success: string } | { err: string } = await response.json();
        if (!response.ok || result instanceof Error) {
            throw new Error(`${(result as { err: string }).err}`);
        }
        return (result as { success: string; }).success;
    } catch (error) {
        return error as Error;
    }
}

export const updateNameAsync = async (upload: { uid: string, name: string }): Promise<string | Error> => {
    const url = "http://localhost:3001/api/user/update-name";

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(upload)
        });
        const result: { success: string } | { err: string } = await response.json();
        if (!response.ok || result instanceof Error) {
            throw new Error(`${(result as { err: string }).err}`);
        }
        return (result as { success: string; }).success;
    } catch (error) {
        return error as Error;
    }
}

export const updateBioAsync = async (upload: { uid: string, bio: string }): Promise<string | Error> => {
    const url = "http://localhost:3001/api/user/update-bio";

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(upload)
        });
        const result: { success: string } | { err: string } = await response.json();
        if (!response.ok || result instanceof Error) {
            throw new Error(`${(result as { err: string }).err}`);
        }
        return (result as { success: string; }).success;
    } catch (error) {
        return error as Error;
    }
}

export const autoSignInAsync = async (token: string): Promise<UserIncidental | Error> => {
    const url = "http://localhost:3001/api/user/token-sign-in";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token,
            },
        });
        const data: { err: string } | UserIncidental = await response.json();
        if (!response.ok) {
            throw new Error(`${(data as { err: string }).err}`);
        }
        return data as UserIncidental;
    } catch (error) {
        return error as Error;
    }
}