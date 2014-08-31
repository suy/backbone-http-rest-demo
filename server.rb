#!/usr/bin/env ruby

require 'sinatra'
require 'json'

helpers do
  def model_file()
    File.join('data', 'user.json')
  end


  #
  # MODEL
  #
  def create_model(model)
    if model['id']
        message = 'You can not set the id when creating'
        logger.info message
        status 400
        message
    else
        collection = JSON.parse(File.read(model_file))
        largest = if collection.empty? then 0 else collection.first['id'] end
        collection.each do |element|
            largest = element['id'] if element['id'] > largest
        end
        logger.info "Largest id was #{largest}. New model will be #{largest+1}."

        model['id'] = largest + 1
        collection << model

        File.open(model_file, 'w') {|f| f.write(JSON.pretty_generate(collection))}

        # Return the model
        content_type :json
        model.to_json
    end
  end

  def update_model(model)

  end

end


get '/' do
    send_file File.join(settings.public_folder, 'index.html')
end

get '/user' do
    send_file File.join('data', 'user.json')
end

get '/user/:id' do |id|
    collection = JSON.parse(File.read(model_file))
    id = id.to_i
    model = collection.find {|item| item if item['id'] == id }
    logger.info model.to_json
    if model
        content_type :json
        model.to_json
    else
        status 404
        message = "Model with id #{id} not found"
        logger.info message
        message
    end
end

post '/user' do
    # Docs say: "in case someone already read it", but why?
    request.body.rewind

    model = JSON.parse request.body.read
    create_model model
end


