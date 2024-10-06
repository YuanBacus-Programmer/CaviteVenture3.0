import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies'; // To read cookies
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload for token typing

// Define the interface for the decoded token to ensure types are consistent
interface DecodedToken extends JwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

// Middleware to verify if the user is authenticated
export function requireAuth(ctx: GetServerSidePropsContext) {
  const { token } = parseCookies(ctx);

  // If there's no token, redirect to signin page
  if (!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken; // Cast to DecodedToken
    console.log('Decoded token:', decoded); // Log decoded user info for debugging

    // If the token is valid, allow access and return user data as props
    return { props: { user: decoded } };
  } catch (error) {
    console.error('JWT verification failed:', error);

    // If token verification fails, redirect to signin
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
}

// Middleware to verify if the user has the required role (e.g., 'admin', 'superadmin')
export function requireRole(ctx: GetServerSidePropsContext, requiredRole: 'admin' | 'superadmin') {
  const { token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken; // Cast to DecodedToken
    console.log('Decoded token:', decoded);

    // Ensure the token contains a role property
    if (!decoded.role) {
      throw new Error('Token does not contain a role');
    }

    // Check if the user has the required role
    if (decoded.role !== requiredRole) {
      return {
        redirect: {
          destination: '/dashboard', // Redirect to dashboard if the user does not have the required role
          permanent: false,
        },
      };
    }

    // If the user has the required role, allow access
    return { props: { user: decoded } };
  } catch (error) {
    console.error('Role verification failed:', error);

    // If verification fails, redirect to signin
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
}

// Middleware to block authenticated users from accessing public pages (e.g., /signin, /signup)
export function blockAuthenticatedUsers(ctx: GetServerSidePropsContext) {
  const { token } = parseCookies(ctx);

  // If the user is authenticated, redirect to dashboard
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      console.log('Authenticated user detected, redirecting:', decoded);

      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    } catch (error) {
      console.error('Token verification failed while blocking public access:', error);
    }
  }

  // If user is not authenticated, allow access to public pages
  return { props: {} };
}
