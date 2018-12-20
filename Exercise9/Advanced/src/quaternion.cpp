#include "quaternion.h"


Quaternion::Quaternion()
{
    // TODO 9.3 a)
    // Initialize the real and imaginary part with a zero degree rotation.
    // Note: The length must still be 1!

    real = 0.0;
    img = vec3(0.0);
}

Quaternion::Quaternion(vec3 axis, float angle)
{
    // TODO 9.3 a)
    // Initialize with classic axis angle rotation as defined in the lecture.

    real = cos(angle / 2);
    img.x = axis.x * sin(angle / 2);
    img.y = axis.y * sin(angle / 2);
    img.z = axis.z * sin(angle / 2);
}



mat3 Quaternion::toMat3()
{
    // Conversion Quaternion -> mat3
    // You won't have to implement it this year :).
    mat3 Result;
    float qxx(img.x * img.x);
    float qyy(img.y * img.y);
    float qzz(img.z * img.z);
    float qxz(img.x * img.z);
    float qxy(img.x * img.y);
    float qyz(img.y * img.z);
    float qwx(real * img.x);
    float qwy(real * img.y);
    float qwz(real * img.z);

    Result[0][0] = float(1) - float(2) * (qyy +  qzz);
    Result[0][1] = float(2) * (qxy + qwz);
    Result[0][2] = float(2) * (qxz - qwy);

    Result[1][0] = float(2) * (qxy - qwz);
    Result[1][1] = float(1) - float(2) * (qxx +  qzz);
    Result[1][2] = float(2) * (qyz + qwx);

    Result[2][0] = float(2) * (qxz + qwy);
    Result[2][1] = float(2) * (qyz - qwx);
    Result[2][2] = float(1) - float(2) * (qxx +  qyy);
    return Result;
}

mat4 Quaternion::toMat4()
{
    return mat4(toMat3());
}


float Quaternion::norm() const
{
    // TODO 9.3 b)
    // Compute the L2 norm of this vector.
    return sqrt(real*real + img.x*img.x + img.y*img.y + img.z*img.z);

}

Quaternion Quaternion::normalize()
{
    // TODO 9.3 b)
    // Normalize this quaternion.
    float norm = this.norm();

    real /= norm;
    img /= norm;

    return *this;

}

Quaternion Quaternion::conjugate() const
{
    // TODO 9.3 b)
	// Return the conjugate of this quaternion.
    Quaternion result;

    result.real = real
    result.img = -img;

    return result;

}

Quaternion Quaternion::inverse() const
{
    // TODO 9.3 b)
	// Return the inverse of this quaternion.
    Quaternion result;

    float l2_norm = norm();

    result = conjugate();

    result.real /= l2_norm * l2_norm;
    result.img /= l2_norm * l2_norm;

    return result;

}



float dot(Quaternion x, Quaternion y)
{
    // TODO 9.3 b)
	// Compute the dot product of x and y.
    return dot(x.img, y.img) + x.real * y.real;
}



Quaternion operator*(Quaternion l, Quaternion r)
{
    // TODO 9.3 c)
    // Perform quaternion-quaternion multiplication as defined in the lecture.
	// Hint: You can use the glm function for vector products.
    Quaternion result;

    result.real = l.real * r.real - dot(l.img, r.img);
    result.img = l.real * r.img + l.img * r.real + cross(l.img, r.img);

    return result;

}

vec3 operator*(Quaternion l, vec3 r)
{
    // TODO 9.3 c)
    // Rotate the vector 'r' with the quaternion 'l'.
    Quartenion q0(0, r);
    Quartenion qm = l * q0 * l.inverse();

    return qm.img;

}

Quaternion operator*(Quaternion l, float r)
{
    // TODO 9.3 c)
    // Perform quaternion-scalar multiplication.
    Quaternion result;

    result.real = l.real * r;
    result.img = l.img * r;

    return result;

}

Quaternion operator+(Quaternion l, Quaternion r)
{
    // TODO 9.3 c)
	// Return the sum of the two quaternions.
    Quaternion result;

    result.real = l.real + r.real;
    result.img = l.img + r.img;
 
    return result;

}



Quaternion slerp(Quaternion x, Quaternion y, float t)
{
	float epsilon = 0.00001;

    // TODO 9.3 d)
    // Spherical linear interpolation (slerp) of quaternions.

    // Compute the interpolated quaternion and return it normalized.
	
    Quaternion result;

    x.normalize();
    y.normalize();

    float dot_xy = dot(x, y);

    if(dot_xy > 1.0 - epsilon) {
      result = x + t * (y - x);
      result.normalize();
      return result;
    }

    float omega = acos(dot_xy);
    float omega_sin = sin(omega);

    result = (sin((1.0 - t) * omega) / omega_sin) * x +
             (sin(t * omega)         / omega_sin) * y;

    return result;
}

std::ostream& operator<<(std::ostream &str, Quaternion r)
{
    str << "( " << r.real << "," << r.img.x << "," << r.img.y << "," << r.img.z << " )";
        return str;
}
