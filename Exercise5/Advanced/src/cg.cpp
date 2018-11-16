﻿#include "cg.h"

using std::cout;
using std::endl;


static void createBuffers(Mesh& mesh, std::vector<VertexNT>& vertices, std::vector<int>& indices, GLenum drawMode = GL_TRIANGLES)
{

    glGenVertexArrays(1, &mesh.vao);
    glBindVertexArray(mesh.vao);

    glGenBuffers(1, &mesh.vbo);
    glBindBuffer(GL_ARRAY_BUFFER, mesh.vbo);
    glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(VertexNT), vertices.data(), GL_STATIC_DRAW);

    glEnableVertexAttribArray( 0 );
    glEnableVertexAttribArray( 1 );
    glEnableVertexAttribArray( 2 );

    glVertexAttribPointer(0,4, GL_FLOAT, GL_FALSE, sizeof(VertexNT), 0 );
    glVertexAttribPointer(1,4, GL_FLOAT, GL_FALSE, sizeof(VertexNT), (void*) (4 * sizeof(GLfloat)) );
    glVertexAttribPointer(2,2, GL_FLOAT, GL_FALSE, sizeof(VertexNT), (void*) (8 * sizeof(GLfloat)) );


    glGenBuffers(1, &mesh.ibo);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.ibo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(int), indices.data(), GL_STATIC_DRAW);

    mesh.numElements = indices.size();
    mesh.drawMode = drawMode;
}

CG::CG(int w, int h) : Window(w,h)
{


    shaderManager.registerProgram("simple_color", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("planar_shadows", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("particle", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("particle_shadows", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.update();

    {
        //load teapot
        ObjLoader2 objLoader;
        objLoader.loadFile("data/teapot.obj");
        std::vector<int> indices;
        for(auto f : objLoader.outTriangles)
        {
            indices.emplace_back(f.v[0]);indices.emplace_back(f.v[1]);indices.emplace_back(f.v[2]);
        }
        createBuffers(teapotMesh,objLoader.outVertices,indices,GL_TRIANGLES);
    }

    {
        //create plane mesh
        std::vector<int> indices = {0,1,2,2,3,0};
        std::vector<VertexNT> vertices;

        VertexNT v;
        v.normal = vec4(0,1,0,0);

        v.position = vec4(-1,0,-1,1);
        v.texture = vec2(0,0);
        vertices.push_back(v);
        v.position = vec4(1,0,-1,1);
        v.texture = vec2(1,0);
        vertices.push_back(v);
        v.position = vec4(1,0,1,1);
        v.texture = vec2(1,1);
        vertices.push_back(v);
        v.position = vec4(-1,0,1,1);
        v.texture = vec2(0,1);
        vertices.push_back(v);

        createBuffers(planeMesh,vertices,indices,GL_TRIANGLES);
    }


    mat4 rotation = glm::rotate(glm::radians(15.0f),vec3(0.3,0,1));
    pointOnPlane = vec3(-1,-2,1);
    planeNormal = normalize(vec3(rotation * vec4(0,1,0,0)));

    teapot = glm::translate(pointOnPlane) * rotation * glm::translate(vec3(0,0.75,0)) * glm::rotate(glm::radians(90.0f),vec3(0,1,0)) * glm::scale(vec3(0.6));
    plane = glm::translate(pointOnPlane) * rotation * glm::scale(vec3(10));

    //initialize particles
    particleStart = vec3(teapot * vec4(3,2.3,0,1));
    for(int i=0;i < 500; ++i)
    {
        Particle p;
        p.position = particleStart;
        p.lifeTime = -1;
        particles.push_back(p);
    }

    camera.lookAt( vec3(0,5,5), vec3(0), vec3(0,1,0));
}

void CG::update(float dt)
{
    shaderManager.update();

    if(!ImGui::GetIO().WantCaptureMouse)
        camera.update(dt);
    dt *= timeScale;
    time += dt;


    for(Particle& p : particles)
    {
        p.lifeTime -= dt;

		// TODO: 5.3 d)
		// Update Particles:
		// - integrate position
		// - reset if lifetime < 0
		//
		// Use the following methods to get random values:
		// float glm::linearRand(float min, float max);
		// vec3 glm::linearRand(vec3 min, vec3 max);

    }
}


void CG::renderOpaqueGeometry()
{
    glm::mat4 projView = camera.getProjectionMatrix() * camera.getViewMatrix();
    glUseProgram(shaderManager.getProgramGL("simple_color"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);


    //plane
    glUniform4fv(2,1,&vec4(0.7,0.7,0.7,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &plane[0][0]);
    planeMesh.render();

    //bunny
    glUniform4fv(2,1,&vec4(1,1,0,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &teapot[0][0]);
    teapotMesh.render();

}

void CG::renderOpaqueGeometryShadows()
{
    glm::mat4 projView = camera.getProjectionMatrix() * camera.getViewMatrix();
    glUseProgram(shaderManager.getProgramGL("planar_shadows"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);
    glUniform3fv(4,1,&pointOnPlane[0]);
    glUniform3fv(5,1,&planeNormal[0]);

    glPolygonOffset(-1, -1);

    glUniform4fv(2,1,&vec4(0,0,0,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &teapot[0][0]);
    glEnable(GL_POLYGON_OFFSET_FILL);
    teapotMesh.render();
    glDisable(GL_POLYGON_OFFSET_FILL);

}

void CG::renderParticles()
{
    glm::mat4 projView = camera.getProjectionMatrix() * camera.getViewMatrix();
    glUseProgram(shaderManager.getProgramGL("particle"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);
    glUniform4fv(2,1,&vec4(1,1,1,1)[0]);



	// TODO: 5.3 e)
	// Render particles with alpha blending.
	// Use glBlendFunc.
	// Don't forget enabling and disabling blending via glEnable() and glDisable().



    for(Particle& p : particles)
    {

		// TODO: 5.3 c)
		// Compute the correct transformation matrix for each particle.
		// The particle must be oriented towards the current camera.
		// Use "camera.getViewMatrix()"!
		// The upper left 3x3 part of a matrix can be obtained by mat3(matrix),
		// a 3x3 matrix can be transformed to a 4x4 one by mat4(matrix).

        mat4 particleTransformation =  glm::translate(p.position); // <- Change this line


        glUniformMatrix4fv(1, 1, GL_FALSE, &particleTransformation[0][0]);
        float timeTmp = time + p.timeOffset;
        glUniform1fv(4,1,&timeTmp);
        planeMesh.render();
    }

}


static mat3 orthonormalBasis(vec3 dir)
{
    mat3 v = mat3();

	// TODO: 5.3 f)
	// Create an orthonormal basis from the unit vector "dir" and store it in "v".
	// The last column (v[2]) should be the negative "dir".
	// Use cross products to obtain the other two vectors.

    return v;
}


void CG::renderParticleShadows()
{
    glm::mat4 projView = camera.getProjectionMatrix() * camera.getViewMatrix();
    glUseProgram(shaderManager.getProgramGL("particle_shadows"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);
    glUniform3fv(4,1,&pointOnPlane[0]);
    glUniform3fv(5,1,&planeNormal[0]);


	// TODO: 5.3 g)
	// Render particles with alpha blending.
	// Remove Z-figthing with glPolygonOffset.
	// Don't forget enabling and disabling everything.

    for(Particle& p : particles)
    {
        mat3 v = orthonormalBasis(lightDir);
        mat4 particleTransformation =  glm::translate(p.position) *  mat4(v) * glm::rotate(glm::radians(90.0f),vec3(1,0,0));
        glUniformMatrix4fv(1, 1, GL_FALSE, &particleTransformation[0][0]);
        float timeTmp = time + p.timeOffset;
        glUniform1fv(6,1,&timeTmp);
        planeMesh.render();
    }

}

void CG::render()
{
    glClearColor(0,0,0,0);

    glDepthMask(GL_TRUE);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glEnable(GL_DEPTH_TEST);

    if(enableGeometry)
    {
        renderOpaqueGeometry();
    }

    //don't write depth values
    glDepthMask(GL_FALSE);

    if(enableTeapotShadows)
    {
        renderOpaqueGeometryShadows();
    }

    if(enableParticleShadows)
    {
        renderParticleShadows();
    }

    if(enableParticles)
    {
        renderParticles();
    }



}

void CG::renderGui()
{
    ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiSetCond_Once);
    ImGui::SetNextWindowSize(ImVec2(300,400), ImGuiSetCond_Once);
    ImGui::Begin("Planar Shadows");

    ImGui::Checkbox("Geometry",&enableGeometry);
    ImGui::Checkbox("TeapotShadows",&enableTeapotShadows);
    ImGui::Checkbox("Particles",&enableParticles);
    ImGui::Checkbox("ParticleShadows",&enableParticleShadows);
    ImGui::SliderFloat("TimeScale",&timeScale,0,2);
    ImGui::Direction("Light Direction",lightDir);

    ImGui::End();
}

